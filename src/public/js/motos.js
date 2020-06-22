import { message, Modal } from './message.js';

window.Moto = class Moto {
    static ingresar(moto) {
        const contenedor = document.getElementById('insertar')
        const insert = document.getElementById('insertar-filas')
        contenedor.removeChild(insert)
        const texto =`
            <div class="row justify-content-md-center align-items-center" id="insertar-filas">
                <div class="col-md-6">
                    <h4>${moto ? 'Editar Moto' : 'Ingresar Moto'}</h4>
                    <form class="card-body" id="formulario">
                        <div class="form-group">
                            <input type="text" id="patente" ${ moto ? `value="${moto.patente}" readonly` : 'placeholder="Patente"'} class="form-control">
                            <span id="patenteError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="number" id="precio" ${ moto ? `value="${moto.precio}"` : 'placeholder="Precio"'} class="form-control">
                            <span id="precioError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="text" id="descripcion" ${ moto ? `value="${moto.descripcion}"` : 'placeholder="Descripcion"'} class="form-control">
                            <span id="descripcionError" class="text-danger"></span>
                        </div>
                        <div class="form-group">
                            <input type="text" id="modelo" ${ moto ? `value="${moto.modelo}"` : 'placeholder="Modelo"'} class="form-control">
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
                        <button type="button" class="btn btn-primary btn-block" ${ moto ? `onclick="Moto.insertar('${moto._id}', '${moto.imagen}');"` : 'onclick="Moto.insertar();"'}>
                            ${moto ? 'Editar' : 'Ingresar'}
                        </button>
                        <button type="button" class="btn btn-light btn-sm btn-block mt-2" onclick="Moto.obtener();">
                            Cancelar
                        </button>
                    </form>
                </div>
                <div class="col-md-4" id="preview">
                    ${moto ? `<img src="img/${moto.imagen}" class="img-fluid" alt=""/>` : `<img src="img/sinimagen.png" class="img-fluid" alt=""/>`}
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', texto)
        document.getElementById("imagen").onchange = function (e) {
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function () {
                let preview = document.getElementById('preview'),
                    image = document.createElement('img');
                image.src = reader.result;
                image.setAttribute('class', 'img-fluid')
                preview.innerHTML = '';
                preview.append(image);
            };
        }
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
        if(!mensaje.type) {
            message.errorMessage(mensaje.message)
        } else {
            message.showMessage(mensaje.message, mensaje.css);
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
        const userJSON = await fetch('motos/todos', { method: 'GET' });
        let motos = JSON.parse(await userJSON.text());
        let i = 0
        if(filtro !== 'todos') {
            motos = motos.filter(moto => moto.marca === filtro)
        } 
        const fragmento = new DocumentFragment()
        motos.map((moto, index) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', `${moto._id}`)
            const tdIndex = document.createElement('td')
            tdIndex.innerText = index + 1;
            const tdPatente = document.createElement('td')
            tdPatente.innerText = moto.patente
            const tdPrecio = document.createElement('td')
            tdPrecio.innerText = moto.precio
            const tdMarca = document.createElement('td')
            tdMarca.innerText = moto.marca
            const tdModelo = document.createElement('td')
            tdModelo.innerText = moto.modelo
            //td estado
            const tdEstado = document.createElement('td')
            const btnEstado = document.createElement('i')
            btnEstado.setAttribute('class', `estado-moto btn btn-sm border-0 btn-outline-${moto.service ? "success fas fa-wrench" : "danger fas fa-motorcycle"}`)
            btnEstado.setAttribute('estado', `${moto.service}`)
            btnEstado.innerText = `${moto.service ? ' Reparacion' : ' Activa'}`
            tdEstado.appendChild(btnEstado)
            //tdAcciones
            // boton Eliminar
            const tdAcciones = document.createElement('td')
            const btnEliminar = document.createElement('i')
            btnEliminar.setAttribute('class', 'btn btn-outline-danger btn-sm border-0 eliminar-moto far fa-trash-alt')
            btnEliminar.setAttribute('imagen', `${moto.imagen}`)
            tdAcciones.appendChild(btnEliminar)
            //boton Editar
            const btnEditar = document.createElement('i')
            btnEditar.setAttribute('class', 'btn btn-outline-primary btn-sm border-0 fas fa-pen-alt editar-moto')
            tdAcciones.appendChild(btnEditar)
            //Agrego los elementos td al elemento tr
            tr.appendChild(tdIndex)
            tr.appendChild(tdPatente)
            tr.appendChild(tdPrecio)
            tr.appendChild(tdMarca)
            tr.appendChild(tdModelo)
            tr.appendChild(tdEstado)
            tr.appendChild(tdAcciones)
            fragmento.appendChild(tr)
        })
        document.getElementById('filas').appendChild(fragmento)
        Moto.inicialar()
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
            message.showMessage(datotexto.message, datotexto.css);
            Moto.obtener();
        }
    }

    static async estado(id, service) {
        const modal = new Modal('ESTADO MOTO', '¿Seguro desea cambiar el estado de este vehiculo?')
        const acept = await modal.confirm();
        if (acept) {
            const body = {}
            body.service = JSON.parse(service)
            const motoJSON = JSON.stringify(body);
            const add = await fetch("/motos/estado/" + id, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}, 
                body: motoJSON
            });
            const datotexto = JSON.parse(await add.text());
            message.showMessage(datotexto.message, datotexto.css);
            Moto.obtener();
        }
    }

    static inicialar() {
        const btn = document.querySelector('#filas')
        btn.addEventListener('click', e => {
            const id = e.target.parentElement.parentElement.getAttribute('data-id')
            if(e.target.classList.contains('eliminar-moto')) {
                Moto.delete(id, e.target.getAttribute('imagen'))
            }
            if(e.target.classList.contains('editar-moto')) {
                Moto.editar(id)
            }
            if(e.target.classList.contains('estado-moto')) {
                Moto.estado(id, e.target.getAttribute('estado'))
            }
        })
    }
}

Moto.obtener();
const btnBuscar = document.getElementById('buscar')
btnBuscar.addEventListener('click', () => Moto.obtener())
const ingresarMoto = document.getElementById('ingresar-moto')
ingresarMoto.addEventListener('click', () => Moto.ingresar())