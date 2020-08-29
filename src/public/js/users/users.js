import { listUsers, ingresarUsuario, editUser } from './views.js'
import { message, Modal } from '../message.js'; 
import { eliminarUser, estadoUser, insertarUsuario } from './dataUser.js'

const users = async () => {
    await listUsers()
    inicializar()
}

const ingresar = () => {
    ingresarUsuario()
    botonesIngreso()
}

const deleteUser = async (id) => {
    const modal = new Modal('ELIMINAR USUARIO' ,'¿Seguro desea eliminar este usuario?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await eliminarUser(id)
        message.showMessage(res.message, res.css);
        users();
    }
}

const userEditar = async (id) => {
    const modal = new Modal('EDITAR USUARIO', '¿Seguro desea editar este usuario?')
    const acept = await modal.confirm();
    if (acept) {
        await editUser(id)
        botonesIngreso(id)
    }
}

const userEstado = async (id, estado) => {
    const modal = new Modal('ESTADO USUARIO', '¿Seguro desea cambiar el estado?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await estadoUser(id, estado)
        message.showMessage(res.message, res.css);
        users()
    }
}

const inicializar = () => {
    const btn = document.querySelector('#insertar-filas')
    btn.addEventListener('click', e => {
        const id = e.target.parentElement.parentElement.getAttribute('data-id')
        if(e.target.classList.contains('usuario-delete')) {
            deleteUser(id)
        }
        if(e.target.classList.contains('usuario-editar')) {
            userEditar(id)
        }
        if(e.target.classList.contains('user-estado')) {
            userEstado(id, e.target.getAttribute('estado'))
        }
    })
}

const botonesIngreso = id => {
    document.getElementById('btn-cancelar').addEventListener('click', () => users())
    const btnInsertar = document.getElementById('btn-insertar')
    const titulo = document.getElementById('titulo-form')
    if(id) {
        titulo.innerText = 'Editar Usuario'
        btnInsertar.innerText = 'Editar'
    } else {
        titulo.innerText = 'Ingresar Usuario'
        btnInsertar.innerText = 'Ingresar'
    }
    btnInsertar.addEventListener('click', async (e) => {
        e.preventDefault()
        const res = id ? await insertarUsuario(id) : await insertarUsuario()
        if(!res.type) {
            message.errorMessage(res.message)
        } else {
            message.showMessage(res.message, res.css);
            users()   
        }
    })
}

window.onload = () => {
    users()
    const btnBuscar = document.getElementById('buscar-usuarios')
    btnBuscar.addEventListener('click', () => users())
    const btnIngresar = document.getElementById('buscar-ingresar')
    btnIngresar.addEventListener('click', () => ingresar())
}