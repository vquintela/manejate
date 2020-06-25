import { texto, formIngreso } from './dataText.js'
import { getUsers, getUser } from './dataUser.js'

const ingresarUsuario = () => {
    const contenedor = document.getElementById('insertar')
    const insert = document.getElementById('filas')
    contenedor.removeChild(insert)
    contenedor.insertAdjacentHTML('beforeend', formIngreso)
}

const listUsers = async () => {
    const rol = document.getElementById('rol-buscar').value;
    const estado = JSON.parse(document.getElementById('estado-buscar').value);
    const contenedor = document.getElementById('App')
    const insert = document.getElementById('insertar')
    contenedor.removeChild(insert)
    contenedor.insertAdjacentHTML( 'beforeend', texto)
    let users = await getUsers()
    if(rol !== 'todos') {
        users = users.filter(user => user.rol === rol && user.state === estado)
    } else {
        users = users.filter(user => user.state === estado)
    }
    const fragmento = new DocumentFragment()
    users.map((user, index) => {
        const tr = generarFila(user, index)
        fragmento.appendChild(tr)
    })
    document.getElementById('insertar-filas').appendChild(fragmento)
}

const generarFila = (user, index) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', `${user._id}`)
    const tdIndex = document.createElement('td')
    tdIndex.innerText = index + 1;
    const tdNombre = document.createElement('td')
    tdNombre.innerText = user.nombre
    const tdApellido = document.createElement('td')
    tdApellido.innerText = user.apellido
    const tdEmail = document.createElement('td')
    tdEmail.innerText = user.email
    const tdTelefono = document.createElement('td')
    tdTelefono.innerText = user.telefono
    const tdRol = document.createElement('td')
    tdRol.innerText = user.rol
    //td estado
    const tdEstado = document.createElement('td')
    const btnEstado = document.createElement('i')
    btnEstado.setAttribute('class', `user-estado border-0 btn-sm btn btn-outline-${user.state ? "success fas fa-user-slash" : "danger far fa-user"}`)
    btnEstado.setAttribute('estado', `${user.state}`)
    tdEstado.appendChild(btnEstado)
    //tdAcciones
    const tdAcciones = document.createElement('td')
    // boton Eliminar
    const btnEliminar = document.createElement('button')
    btnEliminar.setAttribute('class', 'usuario-delete btn btn-outline-danger btn-sm border-0 far fa-trash-alt')
    tdAcciones.appendChild(btnEliminar)
    //boton Editar
    const btnEditar = document.createElement('button')
    btnEditar.setAttribute('class', 'btn btn-outline-primary btn-sm border-0 fas fa-pen-alt usuario-editar')
    tdAcciones.appendChild(btnEditar)
    //Agrego los elementos td al elemento tr
    tr.appendChild(tdIndex)
    tr.appendChild(tdNombre)
    tr.appendChild(tdApellido)
    tr.appendChild(tdEmail)
    tr.appendChild(tdTelefono)
    tr.appendChild(tdRol)
    tr.appendChild(tdEstado)
    tr.appendChild(tdAcciones)
    return tr
}

const editUser = async (id) => {
    const user = await getUser(id)
    ingresarUsuario()
    insertData(user)
}

const insertData = user => {
    document.getElementById('nombre').value = user.nombre
    document.getElementById('apellido').value = user.apellido
    const email = document.getElementById('email')
    email.value = user.email
    email.readOnly = true
    document.getElementById('rol').value = user.rol
    document.getElementById('telefono').value = user.telefono
}

export { listUsers, ingresarUsuario, editUser }