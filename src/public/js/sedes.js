import { message, Modal } from './message.js';

window.Sede = class Sede {
    static async obtenerSede() {
        const contenedor = document.getElementById('insertar')
        const insert = document.getElementById('insertar-filas')
        contenedor.removeChild(insert)
        const texto = `
        <div class="row justify-content-md-center align-items-end" id="insertar-filas">
        <div class="col-md-6">
            <h4>${sede ? 'Editar Sede' : 'Ingresar Sede'}</h4>
            <form class="card-body" id="formulario">
                <div class="form-group">
                    <input type="text" id="direccion" ${ sede ? `value=${sede.direccion} readonly` : 'placeholder="Direccion"'} class="form-control">
                    <span id="direccionError" class="text-danger"></span>
                </div>
                <div class="form-group">
                    <input type="number" id="codigoPostal" ${ sede ? `value=${sede.codigoPostal}` : 'placeholder="Codigo Postal"'} class="form-control">
                    <span id="codigoPostalError" class="text-danger"></span>
                </div>
                <div class="form-group">
                    <input type="text" id="provincia" ${ sede ? `value=${sede.provincia}` : 'placeholder="Provincia"'} class="form-control">
                    <span id="provinciaError" class="text-danger"></span>
                </div>
                <div class="form-group">
                    <input type="text" id="ciudad" ${ sede ? `value=${sede.ciudad}` : 'placeholder="Ciudad"'} class="form-control">
                    <span id="ciudadError" class="text-danger"></span>
                </div>
                <button type="button" class="btn btn-primary btn-block" ${ sede ? `onclick="Sede.insertar('${sede._id}';"` : 'onclick="Sede.insertar();"'}>
                    ${sede ? 'Editar' : 'Ingresar'}
                </button>
            </form>
        </div>
    </div>
`;
contenedor.insertAdjacentHTML('beforeend', texto)

       

Sede.obtener()