import { textoFilas, textoTareas, insertAvance } from './dataText.js'
import { getTareas, getTarea, avancesTareas } from './dataTareas.js'

const ingresarTareas = () => {
    const contenedor = document.getElementById('insertar')
    const insert = document.getElementById('insertar-filas')
    contenedor.removeChild(insert)
    contenedor.insertAdjacentHTML('beforeend', textoTareas)
}

const listTareas = async () => {
    const filtro = document.getElementById('estado-buscar').value;
    const contenedor = document.getElementById('App')
    const insert = document.getElementById('insertar')
    contenedor.removeChild(insert)
    contenedor.insertAdjacentHTML( 'beforeend', textoFilas)
    let tareas = await getTareas()
    if(filtro !== 'todos') {
        tareas = tareas.filter(tarea => tarea.estado === JSON.parse(filtro))
    } 
    const fragmento = new DocumentFragment()
    tareas.map((tarea, index) => {
        const tr = crearFila(tarea, index)
        fragmento.appendChild(tr)
    })
    document.getElementById('filas').appendChild(fragmento)
}

const crearFila = (tarea, index) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', `${tarea._id}`)
    const tdIndex = document.createElement('td')
    tdIndex.innerText = index + 1;
    const tdTitulo = document.createElement('td')
    tdTitulo.innerText = tarea.titulo
    const tdDescripcion = document.createElement('td')
    tdDescripcion.innerText = tarea.descripcion
    //td Avances
    const tdAvances = document.createElement('td')
    const btnAvance = document.createElement('i')
    btnAvance.setAttribute('class', `btn btn-sm border-0 btn-outline-info far fa-comments avances-tarea`)
    btnAvance.innerText = ' Avances'
    tdAvances.appendChild(btnAvance)
    //td estado
    const tdEstado = document.createElement('td')
    const btnEstado = document.createElement('i')
    btnEstado.setAttribute('class', `estado-tarea btn btn-sm border-0 btn-outline-${tarea.estado ? 'warning fas fa-check-double' : 'primary fas fa-list-ul'}`)
    btnEstado.setAttribute('estado', `${tarea.estado}`)
    btnEstado.innerText = tarea.estado ? ' Finalizada' : ' En Curso'
    tdEstado.appendChild(btnEstado)
    //tdAcciones
    // boton Eliminar
    const tdAcciones = document.createElement('td')
    const btnEliminar = document.createElement('i')
    btnEliminar.setAttribute('class', 'btn btn-outline-danger btn-sm border-0 far fa-trash-alt eliminar-tarea')
    tdAcciones.appendChild(btnEliminar)
    //boton Editar
    const btnEditar = document.createElement('i')
    btnEditar.setAttribute('class', 'btn btn-outline-primary btn-sm border-0 fas fa-pen-alt editar-tarea')
    tdAcciones.appendChild(btnEditar)
    //Asignar tarea
    const tdAsignar = document.createElement('td')
    const btnAsignar = document.createElement('button')
    btnAsignar.setAttribute('class', 'btn btn-outline-primary btn-sm asignar-tarea')
    btnAsignar.innerText = tarea.id_user ? tarea.id_user.apellido : 'Asignarme'
    tdAsignar.appendChild(btnAsignar)
    //Agrego los elementos td al elemento tr
    tr.appendChild(tdIndex)
    tr.appendChild(tdTitulo)
    tr.appendChild(tdDescripcion)
    tr.appendChild(tdAvances)
    tr.appendChild(tdEstado)
    tr.appendChild(tdAcciones)
    tr.appendChild(tdAsignar)
    return tr
}

const tareaEditar = async (id) => {
    const tarea = await getTarea(id)
    ingresarTareas()
    insertData(tarea)
}

const insertData = tarea => {
    document.getElementById('titulo').value = tarea.titulo
    document.getElementById('descripcion').value = tarea.descripcion
}

const avances = async (id) => {
    const contenedor = document.getElementById('insertar')
    const filas = document.getElementById('insertar-filas')
    contenedor.removeChild(filas)
    contenedor.insertAdjacentHTML('beforeend', insertAvance)
    const avances = await avancesTareas(id)
    const fragmento = new DocumentFragment()
    avances.avance.map(msg => {
        const div = listAvances(msg)
        fragmento.appendChild(div)
    })
    document.getElementById('msg-tareas').appendChild(fragmento)
}

const listAvances = msg => {
    const div = document.createElement('div')
    div.setAttribute('class', 'card mb-2')
    const fecha = document.createElement('p')
    fecha.innerText = moment(msg.fecha).format('LLL')
    const mensaje = document.createElement('p')
    mensaje.innerText = msg.msg
    const creado = document.createElement('p')
    creado.innerText = `Comentado por: ${msg.nombre}`
    div.appendChild(fecha)
    div.appendChild(mensaje)
    div.appendChild(creado)
    return div
}

export { listTareas, ingresarTareas, tareaEditar, avances }