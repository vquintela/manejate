import { getMotos, getmoto, getSedes, getMarcas } from './dataMoto.js'
import { ingresarText, textoFilas } from './dataText.js'

const ingresarMoto = async () => {
    const contenedor = document.getElementById('insertar')
    const insert = document.getElementById('insertar-filas')
    contenedor.removeChild(insert)
    contenedor.insertAdjacentHTML('beforeend', ingresarText)
    await insertarSedes();
    await insertarMarcas();
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

const insertarMarcas = async () => {
    const marcas = await getMarcas()
    const fragment = new DocumentFragment()
    marcas.map(marca => {
        const fila = document.createElement('option')
        fila.setAttribute('value', marca)
        fila.innerText = marca
        fragment.appendChild(fila)
    })
    document.getElementById('marca').appendChild(fragment)
}

const insertarSedes = async () => {
    const sedes = await getSedes()
    const fragment = new DocumentFragment()
    sedes.map(sede => {
        const fila = document.createElement('option')
        fila.setAttribute('value', sede._id)
        fila.innerText = sede.domicilio
        fragment.appendChild(fila)
    })
    document.getElementById('ubicacion').appendChild(fragment)
}

const listarMotos = async () => {
    const filtro = document.getElementById('rol-buscar').value;
    const contenedor = document.getElementById('App')
    const insert = document.getElementById('insertar')
    contenedor.removeChild(insert)
    contenedor.insertAdjacentHTML('beforeend', textoFilas)
    let motos = await getMotos()
    if(filtro !== 'todos') {
        motos = motos.filter(moto => moto.marca === filtro)
    } 
    const fragmento = new DocumentFragment()
    motos.map((moto, index) => {
        const tr = generarFila(moto, index)
        fragmento.appendChild(tr)
    })
    document.getElementById('filas').appendChild(fragmento)
}

const generarFila = (moto, index) => {
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
    const tdUbicacion = document.createElement('td')
    tdUbicacion.innerText = moto.ubicacion.domicilio
    //td estado
    const tdEstado = document.createElement('td')
    const btnEstado = document.createElement('i')
    btnEstado.setAttribute('class', `estado-moto btn btn-sm border-0 btn-outline-${moto.service ? "success fas fa-wrench" : "danger fas fa-motorcycle"}`)
    btnEstado.setAttribute('estado', `${moto.service}`)
    btnEstado.innerText = `${moto.service ? ' Alquilada' : ' Disponible'}`
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
    btnEditar.setAttribute('imagen', `${moto.imagen}`)
    tdAcciones.appendChild(btnEditar)
    //Agrego los elementos td al elemento tr
 //   tr.appendChild(tdIndex)
    tr.appendChild(tdPatente)
    tr.appendChild(tdPrecio)
    tr.appendChild(tdMarca)
    tr.appendChild(tdModelo)
    tr.appendChild(tdUbicacion)
    tr.appendChild(tdEstado)
    tr.appendChild(tdAcciones)
    return tr
}

const editarMoto = async (id) => {
    const moto = await getmoto(id)
    ingresarMoto()
    insertData(moto)
}

const insertData = async (moto) => {
    const preview = document.getElementById('preview'),
    image = document.createElement('img');
    image.src = moto.imagen;
    image.setAttribute('class', 'img-fluid')
    preview.innerHTML = '';
    preview.append(image);
    document.getElementById('modelo').value = moto.modelo
    document.getElementById('descripcion').value = moto.descripcion
    document.getElementById('ubicActual').innerText = moto.ubicacion.domicilio
    document.getElementById('marcaActual').innerText = moto.marca
    document.getElementById('precio').value = moto.precio
    const patente = document.getElementById('patente')
    patente.value = moto.patente
    patente.readOnly = true; 
}

export { listarMotos, ingresarMoto, editarMoto }