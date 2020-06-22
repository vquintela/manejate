import { message, Modal } from './message.js';

window.Tarea = class Tarea {
    static async obtener() {
        const filtro = document.getElementById('estado-buscar').value;
        const contenedor = document.getElementById('App')
        const insert = document.getElementById('insertar')
        contenedor.removeChild(insert)
        const texto = `
            <div class="col-md-12 text-center" id="insertar">
                <table class="table" id="insertar-filas">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Titulo</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Avance</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Accion</th>
                      </tr>
                    </thead>
                    <tbody id="filas">
                    </tbody>
                </table>
            </div>
        `;
        contenedor.insertAdjacentHTML( 'beforeend', texto)
        const tareasJSON = await fetch('tareas/todas', { method: 'GET' });
        let tareas = JSON.parse(await tareasJSON.text());
        if(filtro !== 'todos') {
            tareas = tareas.filter(tarea => tarea.estado === JSON.parse(filtro))
        } 
        const fragmento = new DocumentFragment()
        tareas.map((tarea, index) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', `${tarea._id}`)
            const tdIndex = document.createElement('td')
            tdIndex.innerText = index + 1;
            const tdTitulo = document.createElement('td')
            tdTitulo.innerText = tarea.titulo
            const tdDescripcion = document.createElement('td')
            tdDescripcion.innerText = tarea.descripcion
            //td Avances
            const tdAvances = document.createElement('td')
            const btnAvance = document.createElement('i')
            btnAvance.setAttribute('class', `btn btn-sm border-0 btn-outline-info far fa-comments avances-tarea`)
            btnAvance.innerText = ' Avances'
            tdAvances.appendChild(btnAvance)
            //td estado
            const tdEstado = document.createElement('td')
            const btnEstado = document.createElement('i')
            btnEstado.setAttribute('class', `estado-tarea btn btn-sm border-0 btn-outline-${tarea.estado ? 'warning fas fa-check-double' : 'primary fas fa-list-ul'}`)
            btnEstado.setAttribute('estado', `${tarea.estado}`)
            btnEstado.innerText = tarea.estado ? ' Finalizada' : ' En Curso'
            tdEstado.appendChild(btnEstado)
            //tdAcciones
            // boton Eliminar
            const tdAcciones = document.createElement('td')
            const btnEliminar = document.createElement('i')
            btnEliminar.setAttribute('class', 'btn btn-outline-danger btn-sm border-0 far fa-trash-alt eliminar-tarea')
            tdAcciones.appendChild(btnEliminar)
            //boton Editar
            const btnEditar = document.createElement('i')
            btnEditar.setAttribute('class', 'btn btn-outline-primary btn-sm border-0 fas fa-pen-alt editar-tarea')
            tdAcciones.appendChild(btnEditar)
            //Agrego los elementos td al elemento tr
            tr.appendChild(tdIndex)
            tr.appendChild(tdTitulo)
            tr.appendChild(tdDescripcion)
            tr.appendChild(tdAvances)
            tr.appendChild(tdEstado)
            tr.appendChild(tdAcciones)
            // document.getElementById('filas').appendChild(tr)
            fragmento.appendChild(tr)
        })
        document.getElementById('filas').appendChild(fragmento)
        Tarea.inicialar()
    }

    static ingresar(tarea) {
        const contenedor = document.getElementById('insertar')
        const insert = document.getElementById('insertar-filas')
        contenedor.removeChild(insert)
        const texto =`
            <div class="col-md-12 text-center" id="insertar-filas">
                <div class="row justify-content-md-center">
                    <div class="col-md-4">
                        <h4>${tarea ? 'Editar Tarea' : 'Ingresar Tarea'}</h4>
                        <form class="card-body" id="formulario">
                            <div class="form-group">
                                <input type="text" id="titulo" ${ tarea ? `value="${tarea.titulo}"` : 'placeholder="Titulo"'} class="form-control">
                                <span id="tituloError" class="text-danger"></span>
                            </div>
                            <div class="form-group">
                                <input type="text" id="descripcion" ${ tarea ? `value="${tarea.descripcion}"` : 'placeholder="Descripcion"'} class="form-control">
                                <span id="descripcionError" class="text-danger"></span>
                            </div>
                            <button type="button" class="btn btn-primary btn-block" ${ tarea ? `onclick="Tarea.insertar('${tarea._id}');"` : 'onclick="Tarea.insertar();"'}>${tarea ? 'Editar' : 'Ingresar'}</button>
                            <button type="button" class="btn btn-light btn-sm btn-block mt-2" onclick="Tarea.obtener();">
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', texto)
    }

    static async insertar(id) {
        const tarea = {}
        tarea.titulo = document.getElementById('titulo').value;
        tarea.descripcion = document.getElementById('descripcion').value;
        let datotexto
        if(id) {
            const tareaJSON = JSON.stringify(tarea);
            const add = await fetch("tareas/editar/" + id, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: tareaJSON
            });
            datotexto = JSON.parse(await add.text());
        } else {
            const tareaJSON = JSON.stringify(tarea);
            const add = await fetch("tareas/insertar", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: tareaJSON
            });
            datotexto = JSON.parse(await add.text());
        }
        if(!datotexto.type) {
            message.errorMessage(datotexto.message)
        } else {
            message.showMessage(datotexto.message, datotexto.css);
            Tarea.obtener();
        }
    }

    static async update(id) {
        const modal = new Modal('EDITAR TAREA', '¿Seguro desea editar esta tarea?')
        const acept = await modal.confirm();
        let tarea;
        if (acept) {
            let resp = await fetch("/tareas/editar/" + id, {method: 'GET'});
            tarea = JSON.parse(await resp.text());
            Tarea.ingresar(tarea)
        }
    }

    static async delete(id) {
        const modal = new Modal('ELIMINAR TAREA' ,'¿Seguro desea eliminar esta tarea?')
        const acept = await modal.confirm();
        if (acept) {
            const resp = await fetch("/tareas/delete/" + id, {method: 'DELETE'});
            const datotexto = JSON.parse(await resp.text());
            message.showMessage(datotexto.message, datotexto.css);
            Tarea.obtener();
        }
    }

    static async estado(id, state) {
        const modal = new Modal('ESTADO TAREA', '¿Seguro desea cambiar el estado?')
        const acept = await modal.confirm();
        if (acept) {
            const body = {state}
            body.state = !JSON.parse(state)
            const tareaJSON = JSON.stringify(body);
            const add = await fetch("/tareas/estado/" + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: tareaJSON
            });
            const datotexto = JSON.parse(await add.text());
            message.showMessage(datotexto.message, datotexto.css);
            Tarea.obtener();
        }
    }

    static async mostrar(id) {
        const contenedor = document.getElementById('insertar')
        const filas = document.getElementById('insertar-filas')
        contenedor.removeChild(filas)
        const insertTarea = `
            <div class="row justify-comtent-md-center" id="insertar-filas">
                <div class="col-md-4">
                    <div class="form-group">
                        <input type="text" id="mensaje-tarea" placeholder="Agregar Avance" class="form-control" />
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-block" id="btn-agregar" type="button">Agregar Avance</button>
                    </div>
                    <button type="button" class="btn btn-light btn-sm btn-block mt-2" onclick="Tarea.obtener();">
                        Cancelar
                    </button>
                </div>
                <div class="col-md-8" id="msg-tareas">
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', insertTarea)
        const resp = await fetch("/tareas/editar/" + id, {method: 'GET'});
        const tarea = JSON.parse(await resp.text());
        const fragmento = new DocumentFragment()
        tarea.avance.map(msg => {
            const div = document.createElement('div')
            div.setAttribute('class', 'card mb-2')
            const fecha = document.createElement('p')
            fecha.innerText = moment(msg.fecha).format('LLL')
            const mensaje = document.createElement('p')
            mensaje.innerText = msg.msg
            div.appendChild(fecha)
            div.appendChild(mensaje)
            fragmento.appendChild(div)
        })
        document.getElementById('msg-tareas').appendChild(fragmento)
        document.getElementById('btn-agregar').addEventListener('click', async () => {
            const ava = {}
            ava.msg = document.getElementById('mensaje-tarea').value
            ava.fecha = Date.now()
            tarea.avance.push(ava)
            console.log(tarea.avance)
            const tareaJSON = JSON.stringify(tarea);
            const add = await fetch("tareas/editar/" + id, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: tareaJSON
            });
            const datotexto = JSON.parse(await add.text());
            this.mostrar(id)
        })
    }

    static inicialar() {
        const btn = document.querySelector('#filas')
        btn.addEventListener('click', e => {
            if(e.target.classList.contains('avances-tarea')){
                Tarea.mostrar(e.target.parentElement.parentElement.getAttribute('data-id'))
            }
            if(e.target.classList.contains('editar-tarea')){
                Tarea.update(e.target.parentElement.parentElement.getAttribute('data-id'))
            }
            if(e.target.classList.contains('eliminar-tarea')){
                Tarea.delete(e.target.parentElement.parentElement.getAttribute('data-id'))
            }
            if(e.target.classList.contains('estado-tarea')){
                const id = e.target.parentElement.parentElement.getAttribute('data-id')
                const estado = e.target.getAttribute('estado')
                Tarea.estado(id, estado)
            }
        })
    }
}

Tarea.obtener()