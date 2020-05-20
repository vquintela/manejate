import { message, Modal } from './message.js';

window.Usuarios = class Usuarios {
    static async obtenerUsuarios() {
        const rol = document.getElementById('rol-buscar').value;
        const estado = JSON.parse(document.getElementById('estado-buscar').value);
        const contenedor = document.getElementById('App')
        const insert = document.getElementById('insertar')
        contenedor.removeChild(insert)
        const texto = `
            <div class="col-md-12 text-center" id="insertar">
                <table class="table" id="insertar-filas">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Email</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Accion</th>
                      </tr>
                    </thead>
                </table>
            </div>
        `;
        contenedor.insertAdjacentHTML( 'beforeend', texto)
        const userJSON = await fetch('users/obtener', { method: 'GET' });
        let users = JSON.parse(await userJSON.text());
        if(rol !== 'todos') {
            users = users.filter(user => user.rol === rol && user.state === estado)
        } else {
            users = users.filter(user => user.state === estado)
        }
        users.map((user, index) => {
            const fila = `
                <tbody >
                    <tr>
                        <td scope="row">${index + 1}</td>
                        <td>${user.nombre}</td>
                        <td>${user.apellido}</td>
                        <td>${user.email}</td>
                        <td>${user.rol}</td>
                        <td><buton class="btn btn-danger" onclick="Usuarios.delete('${user._id}')"><i class="far fa-trash-alt"></i></buton>
                        <buton class="btn btn-primary" onclick="Usuarios.update('${user._id}')"><i class="far fa-edit"></i></buton>
                        <buton class="btn btn-${user.state ? "success" : "danger"}" onclick="Usuarios.estado('${user._id}', ${user.state})">
                        ${user.state ? '<i class="fas fa-user-slash"></i>' : '<i class="far fa-user"></i>'}
                        </buton></td>
                    </tr>
                </tbody>
            `;
            document.getElementById('insertar-filas').insertAdjacentHTML('beforeend', fila)
        })
    }

    static async delete(id) {
        const modal = new Modal('ELIMINAR USUARIO' ,'¿Seguro desea eliminar este usuario?')
        const acept = await modal.confirm();
        if (acept) {
            const user = await fetch("/users/delete/" + id, {method: 'DELETE'});
            const datotexto = JSON.parse(await user.text());
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
            Usuarios.obtenerUsuarios();
        }
    }

    static async update(id) {
        const modal = new Modal('EDITAR USUARIO', '¿Seguro desea editar este usuario?')
        const acept = await modal.confirm();
        let usuario;
        if (acept) {
            let user = await fetch("/users/editar/" + id, {method: 'GET'});
            usuario = JSON.parse(await user.text());
            Usuarios.ingresar(usuario)
        }
    }

    static async ingresar(usuario) {
        const contenedor = document.getElementById('insertar')
        const insert = document.getElementById('insertar-filas')
        contenedor.removeChild(insert)
        const texto =`
            <div class="row justify-content-md-center" id="insertar-filas">
                <form class="card-body col-md-4" id="formulario">
                    <div class="card-header" id="formulario-titulo">
                        <h4>${usuario ? 'Editar Usuario' : 'Ingresar Usuario'}</h4>
                    </div>
                    <div class="form-group mt-4">
                        <input type="text" id="nombre" ${usuario ? `value="${usuario.nombre}"` : 'placeholder="Nombre"'} class="form-control">
                        <span id="nombreError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <input type="text" id="apellido" ${usuario ? `value="${usuario.apellido}"` : 'placeholder="Apellido"'} class="form-control">
                        <span id="apellidoError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <input type="text" id="email" ${usuario ? `value="${usuario.email}" readonly` : 'placeholder="Email"'} class="form-control">
                        <span id="emailError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <input type="text" id="telefono" ${usuario ? `value="${usuario.telefono}"` : 'placeholder="Telefono"'} class="form-control">
                        <span id="telefonoError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <select name="rol" id="rol" class="form-control">
                            <option>${usuario ? usuario.rol : 'rol'}</option>
                            <option>administrador</option>
                            <option>cliente</option>
                        </select>
                        <span id="rolError" class="text-danger"></span>
                    </div>
                    <input value="${usuario ? 'Editar' : 'Ingresar'}" class="btn btn-primary btn-block" ${usuario ? `onclick="Usuarios.editar('${usuario._id}');"` : `onclick="Usuarios.editar();"`} readonly>
                </form>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', texto)
    }

    static async editar(id) {
        const user = {};
        user.nombre = document.getElementById('nombre').value;
        user.apellido = document.getElementById('apellido').value;
        user.email = document.getElementById('email').value;
        user.rol = document.getElementById('rol').value;
        user.telefono = document.getElementById('telefono').value;
        let datotexto
        if(id) {
            const userJSON = JSON.stringify(user);
            const add = await fetch("users/editar/" + id, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: userJSON
            });
            datotexto = JSON.parse(await add.text());
        } else {
            const userJSON = JSON.stringify(user);
            const add = await fetch("users/insertar", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: userJSON
            });
            datotexto = JSON.parse(await add.text());
        }
        if(datotexto.redirect === 'error') {
            message.errorMessage(datotexto.message)
        } else {
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
            Usuarios.obtenerUsuarios();
        }
    }

    static async estado(id, state) {
        const modal = new Modal('ESTADO USUARIO', '¿Seguro desea cambiar el estado?')
        const acept = await modal.confirm();
        if (acept) {
            const body = { state }
            body.state = !state
            const userJSON = JSON.stringify(body);
            const add = await fetch("/users/estado/" + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: userJSON
            });
            const datotexto = JSON.parse(await add.text());
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
            Usuarios.obtenerUsuarios();
        }
    }
}

Usuarios.obtenerUsuarios();