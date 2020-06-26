const getTareas = async () => {
    const tareasJSON = await fetch('tareas/todas', { method: 'GET' });
    return JSON.parse(await tareasJSON.text());
}

const getTarea = async (id) => {
    let resp = await fetch("/tareas/editar/" + id, {method: 'GET'});
    return JSON.parse(await resp.text());
}

const tareaDelete = async (id) => {
    const resp = await fetch("/tareas/delete/" + id, {method: 'DELETE'});
    return JSON.parse(await resp.text());
}

const insertarTarea = async (id) => {
    const tarea = {}
    tarea.titulo = document.getElementById('titulo').value;
    tarea.descripcion = document.getElementById('descripcion').value;
    if(id) {
        const add = await fetch("tareas/editar/" + id, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(tarea)
        });
        return JSON.parse(await add.text());
    } else {
        const add = await fetch("tareas/insertar", {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(tarea)
        });
        return JSON.parse(await add.text());
    }
}

const tareaEstado = async (id, state) => {
    const body = {state}
    body.state = !JSON.parse(state)
    const add = await fetch("/tareas/estado/" + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return JSON.parse(await add.text());
}

const avancesTareas = async (id) => {
    const resp = await fetch("/tareas/editar/" + id, {method: 'GET'});
    return JSON.parse(await resp.text());
}

const agregarAvance = async (id, avance) => {
    const ava = {}
    ava.msg = document.getElementById('mensaje-tarea').value
    ava.fecha = Date.now()
    avance.push(ava)
    const add = await fetch("tareas/avance/" + id, {
        method: 'PUT', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(avance)
    });
    return JSON.parse(await add.text());
}

const tareaAsignar = async (id) => {
    const asign = await fetch("tareas/asignar/" + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return JSON.parse(await asign.text())
}

const tareaDesasignar = async (id) => {
    const asign = await fetch("tareas/desasignar/" + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return JSON.parse(await asign.text())
}

export { getTareas, tareaDelete, insertarTarea, tareaEstado, getTarea, avancesTareas, agregarAvance, tareaAsignar, tareaDesasignar }