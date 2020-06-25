const getUsers = async () => {
    const userJSON = await fetch('users/obtener', { method: 'GET' });
    return JSON.parse(await userJSON.text());
}

const getUser = async (id) => {
    const user = await fetch("/users/editar/" + id, {method: 'GET'});
    return JSON.parse(await user.text());
}

const eliminarUser = async (id) => {
    const user = await fetch("/users/delete/" + id, {method: 'DELETE'});
    return JSON.parse(await user.text());
}

const estadoUser = async (id, state) => {
    const body = { state }
    body.state = !JSON.parse(state)
    const userJSON = JSON.stringify(body);
    const add = await fetch("/users/estado/" + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: userJSON
    });
    return JSON.parse(await add.text());
}

const insertarUsuario = async (id) => {
    const user = {};
    user.nombre = document.getElementById('nombre').value;
    user.apellido = document.getElementById('apellido').value;
    user.email = document.getElementById('email').value;
    user.rol = document.getElementById('rol').value;
    user.telefono = document.getElementById('telefono').value;
    if(id) {
        const add = await fetch("users/editar/" + id, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(user)
        });
        return JSON.parse(await add.text());
    } else {
        const add = await fetch("users/insertar", {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(user)
        });
        return JSON.parse(await add.text());
    }
}

export { getUsers, eliminarUser, estadoUser, insertarUsuario, getUser }