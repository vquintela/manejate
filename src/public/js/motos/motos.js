import { listarMotos, ingresarMoto, editarMoto } from './views.js'
import { message, Modal } from '../message.js';
import { eliminarMoto, changeState, insertarMoto } from './dataMoto.js'

const motos = async () => {
    await listarMotos()
    inicialar()
}

const ingresar = () => {
    ingresarMoto()
    botonesIngreso()
}

const deleteMoto = async (id, imagen) => {
    const modal = new Modal('ELIMINAR MOTO', '¿Seguro desea eliminar este vehiculo?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await eliminarMoto(id, imagen)
        message.showMessage(res.message, res.css);
        motos();
    }
}

const editar = async (id, imagen) => {
    const modal = new Modal('EDITAR MOTO', '¿Seguro desea editar este vehiculo?')
    const acept = await modal.confirm();
    if (acept) {
        await editarMoto(id)
        botonesIngreso(id, imagen)
    }
}

const estado = async (id, estado) => {
    const modal = new Modal('ESTADO MOTO', '¿Seguro desea cambiar el estado de este vehiculo?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await changeState(id, estado)
        message.showMessage(res.message, res.css);
        motos();
    }
}

const inicialar = () => {
    const btn = document.querySelector('#filas')
    btn.addEventListener('click', e => {
        const id = e.target.parentElement.parentElement.getAttribute('data-id')
        if(e.target.classList.contains('eliminar-moto')) {
            deleteMoto(id, e.target.getAttribute('imagen'))
        }
        if(e.target.classList.contains('editar-moto')) {
            editar(id, e.target.getAttribute('imagen'))
        }
        if(e.target.classList.contains('estado-moto')) {
            estado(id, e.target.getAttribute('estado'))
        }
    })
}

const botonesIngreso = (id, imagen) => {
    document.getElementById('btn-cancelar').addEventListener('click', () => motos())
    const btnInsertar = document.getElementById('btn-insertar')
    const titulo = document.getElementById('titulo-motos')
    if(id) {
        titulo.innerText = 'Editar Moto'
        btnInsertar.innerText = 'Editar'
    } else {
        titulo.innerText = 'Ingresar Moto'
        btnInsertar.innerText = 'Ingresar'
    }
    btnInsertar.addEventListener('click', async (e) => {
        e.preventDefault()
        const res = id ? await insertarMoto(id, imagen) : await insertarMoto()
        if(!res.type) {
            message.errorMessage(res.message)
        } else {
            message.showMessage(res.message, res.css);
            motos()   
        }
    })
}

window.onload = () => {
    motos()
    const btnBuscar = document.getElementById('buscar')
    btnBuscar.addEventListener('click', () => motos())
    const ingresarMoto = document.getElementById('ingresar-moto')
    ingresarMoto.addEventListener('click', () => ingresar())
}