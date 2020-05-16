import { message, Modal } from './message.js';

window.Tarea = class Tarea {
    static async obtener() {
        const filtro = document.getElementById('estado-buscar').value;
        document.getElementById('insertar').innerHTML = `
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
        `;
        const tareasJSON = await fetch('tareas/todas', { method: 'GET' });
        let tareas = JSON.parse(await tareasJSON.text());
        if(filtro !== 'todos') {
            tareas = tareas.filter(tarea => tarea.estado === filtro)
        } 
        tareas.map((tarea, index) => {
            document.getElementById('insertar-filas').innerHTML += `
                    <tbody >
                        <tr>
                            <td scope="row">${index +1}</td>
                            <td>${tarea.titulo}</td>
                            <td>${tarea.descripcion}</td>
                            <td>${tarea.avance}</td>
                            <td><buton class="btn btn-alert">Ver Reserva</buton></td>
                            <td><buton ${tarea.estado ? 'class="btn btn-info"' : 'class="btn btn-alert"'} onclick="Tarea.estado('${tarea._id}', ${tarea.estado})">
                            ${tarea.estado ? 'Finalizada' : 'En Curso'}</buton></td>
                            <td><buton class="btn btn-danger" onclick="Tarea.delete('${tarea._id}')"><i class="far fa-trash-alt"></i></buton>
                            <buton class="btn btn-primary" onclick="Tarea.update('${tarea._id}')"><i class="far fa-edit"></i></buton></td>
                        </tr>
                    </tbody>
                </table>
            `;
        })
    }

    static ingresar(tarea) {
        document.getElementById('insertar').innerHTML =`
            <div class="card-header" id="formulario-titulo">
                <h4>${tarea ? 'Editar Tarea' : 'Ingresar Tarea'}</h4>
            </div>
            <div class="row justify-content-md-center">
                <div class="col-md-4">
                    <form class="card-body" id="formulario">
                        <div class="form-group">
                            <input type="text" id="titulo" ${ tarea ? `value=${tarea.titulo}` : 'placeholder="Titulo"'} class="form-control">
                            <span id="tituloError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="text" id="descripcion" ${ tarea ? `value=${tarea.descripcion}` : 'placeholder="Descripcion"'} class="form-control">
                            <span id="descripcionError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="text" id="avance" ${ tarea ? `value=${tarea.avance}` : 'placeholder="Avance"'} class="form-control">
                            <span id="avanceError" class="text-danger"></span>
                        </div>
                        <input value="Ingresar" class="btn btn-primary btn-block" ${ tarea ? `onclick="Tarea.insertar('${tarea._id}');"` : 'onclick="Tarea.insertar();"'} readonly>
                    </form>
                </div>
            </div>
        `;
    }

    static async insertar(id) {
        const tarea = {}
        tarea.titulo = document.getElementById('titulo').value;
        tarea.descripcion = document.getElementById('descripcion').value;
        tarea.avance = document.getElementById('avance').value;
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
}

Tarea.obtener()