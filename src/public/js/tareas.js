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
                        <th scope="col">Detalle Reserva</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Accion</th>
                      </tr>
                    </thead>
                </table>
            </div>
        `;
        contenedor.insertAdjacentHTML( 'beforeend', texto)
        const tareasJSON = await fetch('tareas/todas', { method: 'GET' });
        let tareas = JSON.parse(await tareasJSON.text());
        if(filtro !== 'todos') {
            tareas = tareas.filter(tarea => tarea.estado === JSON.parse(filtro))
        } 
        tareas.map((tarea, index) => {
            const fila = `
                <tbody >
                    <tr>
                        <td scope="row">${index +1}</td>
                        <td>${tarea.titulo}</td>
                        <td>${tarea.descripcion}</td>
                        <td><button class="btn btn-secondary btn-sm" onclick="Tarea.mostrar('${tarea._id}')">Ver Avances</button></td>
                        <td><button class="btn btn-success btn-sm">Ver Reserva</button></td>
                        <td><button ${tarea.estado ? 'class="btn btn-warning btn-sm"' : 'class="btn btn-primary btn-sm"'} onclick="Tarea.estado('${tarea._id}', ${tarea.estado})">
                        ${tarea.estado ? 'Finalizada' : 'En Curso'}</button></td>
                        <td><button class="btn btn-outline-danger btn-sm" onclick="Tarea.delete('${tarea._id}')"><i class="far fa-trash-alt"></i></button>
                        <button class="btn btn-outline-primary btn-sm" onclick="Tarea.update('${tarea._id}')"><i class="fas fa-pen-alt"></i></button></td>
                    </tr>
                </tbody>
            `;
            document.getElementById('insertar-filas').insertAdjacentHTML('beforeend', fila)
        })
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
                                <input type="text" id="titulo" ${ tarea ? `value=${tarea.titulo}` : 'placeholder="Titulo"'} class="form-control">
                                <span id="tituloError" class="text-danger"></span>
                            </div>
                            <div class="form-group">
                                <input type="text" id="descripcion" ${ tarea ? `value=${tarea.descripcion}` : 'placeholder="Descripcion"'} class="form-control">
                                <span id="descripcionError" class="text-danger"></span>
                            </div>
                            <button type="button" class="btn btn-primary btn-block" ${ tarea ? `onclick="Tarea.insertar('${tarea._id}');"` : 'onclick="Tarea.insertar();"'}>${tarea ? 'Editar' : 'Ingresar'}</button>
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
        if(datotexto.redirect === 'error') {
            message.errorMessage(datotexto.message)
        } else {
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
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
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
            Tarea.obtener();
        }
    }

    static async estado(id, state) {
        const modal = new Modal('ESTADO TAREA', '¿Seguro desea cambiar el estado?')
        const acept = await modal.confirm();
        if (acept) {
            const body = {state}
            body.state = !state
            const tareaJSON = JSON.stringify(body);
            const add = await fetch("/tareas/estado/" + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: tareaJSON
            });
            const datotexto = JSON.parse(await add.text());
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
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
                </div>
                <div class="col-md-8" id="msg-tareas">
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', insertTarea)
        const resp = await fetch("/tareas/editar/" + id, {method: 'GET'});
        const tarea = JSON.parse(await resp.text());
        tarea.avance.map(msg => {
            const parrafo = `
                <div class="card mb-2">
                    <p>${moment(msg.fecha).format('LLL')}</p>
                    <p>${msg.msg}</p>
                <div>
            `;
            document.getElementById('msg-tareas').insertAdjacentHTML('beforeend', parrafo)
        })
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
}

Tarea.obtener()

/*
 tarea.avance = []
        document.querySelectorAll('.avance').forEach(mensaje => {
            const ava = {}
            ava.msg = mensaje.value
            ava.fecha = Date.now()
            tarea.avance.push(ava)
        });

*/