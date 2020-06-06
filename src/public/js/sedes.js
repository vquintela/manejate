// import { message, Modal } from './message.js';

const  obtenerSede = async () => {
        const contenedor = document.getElementById('App')
        const insert = document.getElementById('insertar')
        contenedor.removeChild(insert)  
        const texto = `
        <div class="col-md-12 text-center" id="insertar">
            <table class="table" id="insertar-filas">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Direccion</th>
                    <th scope="col">Codigo Postal</th>
                    <th scope="col">Provincia</th>
                    <th scope="col">Ciudad</th>
                  </tr>
                </thead>
            </table>
        </div>
    `;
        contenedor.insertAdjacentHTML("beforeend",texto)
        let sedes = await fetch("/sedes/todos", {method: 'GET'});
        sedes = JSON.parse(await sedes.text());   
        sedes.map((sede,index) =>{
            const texto = `

            <td scope="row">${index + 1}</td>
            <td>${sede.domicilio}</td>
            <td>${sede.codigoPostal}</td>
            <td>${sede.provincia}</td>
            <td>${sede.ciudad}</td>
    `;
    document.getElementById("insertar-filas").insertAdjacentHTML("beforeend",texto)
        })
    }

        const ingresarSede = async (sede) =>{
        const contenedor = document.getElementById('insertar')
        const insert = document.getElementById('insertar-filas')
        contenedor.removeChild(insert)
        const texto =`
            <div class="row justify-content-md-center" id="insertar-filas">
                <form class="card-body col-md-4" id="formulario">
                    <div class="card-header" id="formulario-titulo">
                        <h4>${sede ? 'Editar Sede' : 'Ingresar Sede'}</h4>
                    </div>
                    <div class="form-group mt-4">
                        <input type="text" id="domicilio" ${sede ? `value="${sede.domicilio}"` : 'placeholder="Direccion"'} class="form-control">
                        <span id="domicilioError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <input type="text" id="codigoPostal" ${sede ? `value="${sede.codigoPostal}"` : 'placeholder="Codigo Postal"'} class="form-control">
                        <span id="codigoPostalError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <input type="text" id="provincia" ${sede ? `value="${sede.provincia}" readonly` : 'placeholder="Provincia"'} class="form-control">
                        <span id="provinciaError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <input type="text" id="ciudad" ${sede ? `value="${sede.ciudad}"` : 'placeholder="Ciudad"'} class="form-control">
                        <span id="ciudadError" class="text-danger"></span>
                    </div>
                    <button type="button" class="btn btn-primary btn-block" ${sede ? `onclick="editarSede('${sede._id}');"` : `onclick="editarSede();"`}>
                        ${sede ? 'Editar' : 'Ingresar'}
                    </button>
                </form>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', texto)

    }
const deleteSede = async (id) => {
    const modal = new Modal('ELIMINAR SEDE', '¿Seguro desea eliminar esta sede?')
    const acept = await modal.confirm();
    if (acept) {
        const sede = await fetch("/sedes/delete/" + id, { method: 'DELETE' });
        const datotexto = JSON.parse(await sede.text());
        message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
        Sede.obtenerSede();
    }
}
const updateSede = async (id) => {
    const modal = new Modal('EDITAR SEDE', '¿Seguro desea editar esta sede?')
    const acept = await modal.confirm();
    let sede;
    if (acept) {
        let sede = await fetch("/sedes/editar/" + id, {method: 'GET'});
        sede = JSON.parse(await sede.text());
        Sede.ingresar(sede)
    }
}

const editarSede = async (id) => {
    const sede = {};
    sede.domicilio = document.getElementById('domicilio').value;
    sede.codigoPostal = document.getElementById('codigoPostal').value;
    sede.provincia = document.getElementById('provincia').value;
    sede.ciudad = document.getElementById('ciudad').value;
    let datotexto
    if(id) {
        const sedeJSON = JSON.stringify(sede);
        const add = await fetch("sedes/editar/" + id, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: sedeJSON
        });
        datotexto = JSON.parse(await add.text());
    } else {
        const sedeJSON = JSON.stringify(sede);
        const add = await fetch("sedes/insertar", {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: sedeJSON
        });
        datotexto = JSON.parse(await add.text());
    }
    if(datotexto.redirect === 'error') {
        message.errorMessage(datotexto.message)
    } else {
        message.showMessage(datotexto.message, datotexto.css, datotexto.redirect);
        Sedes.obtenerSede();
    }
}
       

obtenerSede()