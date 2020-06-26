import { listTareas, ingresarTareas, tareaEditar, avances } from './views.js'
import { tareaDelete, insertarTarea, tareaEstado, agregarAvance, tareaAsignar, tareaDesasignar } from './dataTareas.js'
import { message, Modal } from '../message.js';

const tareas = async () => {
    await listTareas()
    inicialar()
}

const tareasIngresar = async () => {
    await ingresarTareas()
    botonesIngresar()
}

const editarTarea = async (id) => {
    const modal = new Modal('EDITAR TAREA', '¿Seguro desea editar esta tarea?')
    const acept = await modal.confirm();
    if (acept) {
        await tareaEditar(id)
        botonesIngresar(id)
    }
}

const deleteTarea = async (id) => {
    const modal = new Modal('ELIMINAR TAREA' ,'¿Seguro desea eliminar esta tarea?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await tareaDelete(id)
        message.showMessage(res.message, res.css);
        tareas();
    }
}

const estadoTarea = async (id, estado) => {
    const modal = new Modal('ESTADO TAREA', '¿Seguro desea cambiar el estado?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await tareaEstado(id, estado)
        message.showMessage(res.message, res.css);
        tareas();
    }
}

const avanceTarea = async (id) => {
    await avances(id)
    botonesAvance(id)
}

const asignarTarea = async (id) => {
    const modal = new Modal('ASIGNAR TAREA', '¿Seguro desea asignarse esta tarea?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await tareaAsignar(id)
        message.showMessage(res.message, res.css);
        tareas();
    }
}

const desasignarTarea = async (id) => {
    const modal = new Modal('DESASIGNAR TAREA', '¿Seguro desea desasignarse esta tarea?')
    const acept = await modal.confirm();
    if (acept) {
        const res = await tareaDesasignar(id)
        message.showMessage(res.message, res.css);
        tareas();
    }
}

const inicialar = () => {
    const btn = document.querySelector('#filas')
    btn.addEventListener('click', e => {
        const id = e.target.parentElement.parentElement.getAttribute('data-id')
        if(e.target.classList.contains('avances-tarea')){
            avanceTarea(id)
        }
        if(e.target.classList.contains('editar-tarea')){
            editarTarea(id)
        }
        if(e.target.classList.contains('eliminar-tarea')){
            deleteTarea(id)
        }
        if(e.target.classList.contains('estado-tarea')){
            const estado = e.target.getAttribute('estado')
            estadoTarea(id, estado)
        }
        if(e.target.classList.contains('asignar-tarea')){
            if(e.target.innerText != 'Asignarme') {
                desasignarTarea(id)
            } else {
                asignarTarea(id)
            }
        }
    })
}

const botonesIngresar = id => {
    document.getElementById('cancelar-tarea').addEventListener('click', () => tareas())
    const btnInsertar = document.getElementById('ingresartarea')
    const titulo = document.getElementById('tareas-title')
    if(id) {
        titulo.innerText = 'Editar Tarea'
        btnInsertar.innerText = 'Editar'
    } else {
        titulo.innerText = 'Ingresar Tarea'
        btnInsertar.innerText = 'Ingresar'
    }
    btnInsertar.addEventListener('click', async (e) => {
        e.preventDefault()
        const res = id ? await insertarTarea(id) : await insertarTarea()
        if(!res.type) {
            message.errorMessage(res.message)
        } else {
            message.showMessage(res.message, res.css);
            tareas()   
        }
    })
}

const botonesAvance = (id) => {
    let avances = []
    document.getElementById('cancelar-avance').addEventListener('click', () => tareas())
    document.getElementById('btn-agregar').addEventListener('click', async (e) => {
        e.preventDefault()
        document.querySelectorAll('.card').forEach(e => {
            let avance = {}
            avance.fecha = e.firstChild.innerText
            avance.msg = e.getElementsByTagName('p')[1].innerText
            avance.nombre = e.getElementsByTagName('p')[2].innerText
            avances.push(avance)
        })
        const res = await agregarAvance(id, avances)
        avanceTarea(id)
    })
}

window.onload = () => {
    tareas()
    const ingTarea = document.getElementById('ingresar-tarea')
    ingTarea.addEventListener('click', () => tareasIngresar())
    const buscTarea = document.getElementById('buscar-tarea')
    buscTarea.addEventListener('click', () => tareas())
}