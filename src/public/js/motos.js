import { message, Modal } from './message.js';

window.Moto = class Moto {
    static ingresar(moto) {
        const contenedor = document.getElementById('insertar')
        const insert = document.getElementById('insertar-filas')
        contenedor.removeChild(insert)
        const texto =`
            <div class="row justify-content-md-center align-items-end" id="insertar-filas">
                <div class="col-md-6">
                    <h4>${moto ? 'Editar Moto' : 'Ingresar Moto'}</h4>
                    <form class="card-body" id="formulario">
                        <div class="form-group">
                            <input type="text" id="patente" ${ moto ? `value=${moto.patente} readonly` : 'placeholder="Patente"'} class="form-control">
                            <span id="patenteError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="number" id="precio" ${ moto ? `value=${moto.precio}` : 'placeholder="Precio"'} class="form-control">
                            <span id="precioError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="text" id="descripcion" ${ moto ? `value=${moto.descripcion}` : 'placeholder="Descripcion"'} class="form-control">
                            <span id="descripcionError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="text" id="modelo" ${ moto ? `value=${moto.modelo}` : 'placeholder="Modelo"'} class="form-control">
                            <span id="modeloError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="file" id="imagen" class="form-control-file">
                        </div>
                        <div class="form-group">
                            <select id="marca" class="form-control">
                                <option>${ moto ? moto.marca : "marca"}</option>
                                <option>honda</option>
                                <option>yamaha</option>
                                <option>zanella</option>
                                <option>beta</option>
                            </select>
                            <span id="marcaError" class="text-danger"></span>
                        </div>
                        <input value="Ingresar" class="btn btn-primary btn-block" ${ moto ? `onclick="Moto.insertar('${moto._id}', '${moto.imagen}');"` : 'onclick="Moto.insertar();"'} readonly>
                    </form>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', texto)
    }

    static async insertar(id, imagen) {
        const formData = new FormData();
        formData.append('image', document.getElementById('imagen').files[0]);
        formData.append('modelo', document.getElementById('modelo').value)
        formData.append('descripcion', document.getElementById('descripcion').value)
        formData.append('marca', document.getElementById('marca').value)
        formData.append('precio', document.getElementById('precio').value)
        formData.append('patente', document.getElementById('patente').value)
        let mensaje;
        if(id) {
            formData.append('imagen', imagen)
            const text = await fetch('/motos/editar/' + id, {
                method: 'POST',
                body: formData
            })
            mensaje = JSON.parse(await text.text());
        } else {
            const text = await fetch('/motos/insertar', {
                method: 'POST',
                body: formData
            })
            mensaje = JSON.parse(await text.text());
        }
        if(mensaje.redirect === 'error') {
            message.errorMessage(mensaje.message)
        } else {
            message.showMessage(mensaje.message, mensaje.css, mensaje.redirect);
            Moto.obtener()   
        }
    }

    static async obtener() {
        const filtro = document.getElementById('rol-buscar').value;
        const contenedor = document.getElementById('App')
        const insert = document.getElementById('insertar')
        contenedor.removeChild(insert)
        const texto = `
            <div class="col-md-12 text-center" id="insertar">
                <table class="table" id="insertar-filas">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Patente</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Marca</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Accion</th>
                      </tr>
                    </thead>
                </table>
            </div>
        `;
        contenedor.insertAdjacentHTML( 'beforeend', texto)
        const userJSON = await fetch('motos/todos', { method: 'GET' });
        let motos = JSON.parse(await userJSON.text());
        let i = 0
        if(filtro !== 'todos') {
            motos = motos.filter(moto => moto.marca === filtro)
        } 
        motos.map((moto, index) => {
            const fila = `
                <tbody >
                    <tr>
                        <td scope="row">${index +1}</td>
                        <td>${moto.patente}</td>
                        <td>${moto.precio}</td>
                        <td>${moto.marca}</td>
                        <td>${moto.modelo}</td>
                        <td><buton class="btn btn-danger" onclick="Moto.delete('${moto._id}', '${moto.imagen}')"><i class="far fa-trash-alt"></i></buton>
                        <buton class="btn btn-primary" onclick="Moto.editar('${moto._id}')"><i class="far fa-edit"></i></buton>
                        <buton class="btn btn-${moto.service ? "success" : "danger"}" onclick="Moto.estado('${moto._id}', ${moto.service})">
                        ${moto.service ? '<i class="fas fa-motorcycle"></i>' : '<i class="fas fa-wrench"></i>'}
                        </buton></td>
                    </tr>
                </tbody>
            `;
            document.getElementById('insertar-filas').insertAdjacentHTML('beforeend', fila)
        })
    }

    static async editar(id) {
        const modal = new Modal('EDITAR MOTO', '¿Seguro desea editar este vehiculo?')
        const acept = await modal.confirm();
        if (acept) {
            const motoJSON = await fetch('/motos/editar/' + id, {method: 'GET'});
            const moto = JSON.parse(await motoJSON.text());
            Moto.ingresar(moto)
        }
    }

    static async delete(id, image) {
        const modal = new Modal('ELIMINAR MOTO', '¿Seguro desea eliminar este vehiculo?')
        const acept = await modal.confirm();
        if (acept) {
            const data = {}
            data.imagen = image
            const dataJSON = JSON.stringify(data);
            const resp = await fetch("/motos/delete/" + id, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: dataJSON
            });
            const datotexto = JSON.parse(await resp.text());
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
            Moto.obtener();
        }
    }

    static async estado(id, service) {
        const modal = new Modal('ESTADO MOTO', '¿Seguro desea cambiar el estado de este vehiculo?')
        const acept = await modal.confirm();
        if (acept) {
            const body = {}
            body.service = !service
            const motoJSON = JSON.stringify(body);
            const add = await fetch("/motos/estado/" + id, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}, 
                body: motoJSON
            });
            const datotexto = JSON.parse(await add.text());
            message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
            Moto.obtener();
        }
    }
}

Moto.obtener();
