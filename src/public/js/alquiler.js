//ANIMACION BTN SIDEBAR
const btnSidebar = document.getElementById('btn-sidebar');
if (btnSidebar) btnSidebar.addEventListener('click', () => {
  document.querySelector('.sidebar-index').classList.toggle('show-sidebar');
})

const editarAlquiler = function () {
  console.log(this.attributes["editar-alquiler"].value);
};

function cancelarAlquiler() {
  fetch(`/alquileres/cancelar/${this.attributes["cancelar-alquiler"].value}`, {
    method: "PUT",
  }).then(() => {
    const modal = $('#modal-cancelacion');
    modal.find(".modal-title").text(`CANCELADO`);
    modal.find(".modal-body").text('Alquiler cancelado correctamente');
    modal.modal('show');
    location.reload();
  });
}

// Muestra Informacion de la moto alquilada
const verMoto = async (id) => {
  const motoJSON = await fetch("/motos/editar/" + id, { method: "GET" });
  const res = JSON.parse(await motoJSON.text());
  mostrarMoto(res);
};
// Inserta la Informacion de la moto alquilada
const mostrarMoto = (res) => {
  const contenedor = document.querySelector(".contenedor-modal");
  const body = document.querySelector("body");
  contenedor.style.display = "block";
  body.style.overflowY = "hidden";
  document.getElementById("marca").innerText = res.marca;
  document.getElementById("modelo").innerText = res.modelo;
  document.getElementById("precio").innerText = res.precio;
  document.getElementById("descripcion").innerText = res.descripcion;
  document.getElementById("ubicacion").innerText = res.ubicacion.domicilio;
  document.getElementById("img-modal").src = res.imagen;
  document.getElementById("cerrarRegistro").addEventListener("click", () => {
    contenedor.style.display = "none";
    body.style.overflowY = "visible";
  });
};

document
  .querySelectorAll("[editar-alquiler]")
  .forEach((e) => e.addEventListener("click", editarAlquiler));

document
  .querySelectorAll("[cancelar-alquiler]")
  .forEach((e) => e.addEventListener("click", cancelarAlquiler));

document
  .querySelectorAll("[entregar-moto]")
  .forEach((e) => e.addEventListener("click", () => entregarMoto(e.getAttribute("entregar-moto"), e.getAttribute("moto-id"))));

document
  .querySelectorAll("[finalizar-alquiler]")
  .forEach((e) => e.addEventListener("click", () => finalizarAlquiler(e.getAttribute("finalizar-alquiler"))));

document
  .querySelectorAll(".ver-moto")
  .forEach((e) =>
    e.addEventListener("click", () => verMoto(e.getAttribute("moto-id")))
  );

const inputEstado = document.getElementById('estado-buscar');
if (inputEstado) {
  inputEstado.addEventListener('change', e => {
    const estado = e.target.value;
    let usuario = document.getElementById('usuario-busqueda').value;
    if(usuario === '') usuario = 'todos';
    datosAlquileres(estado, usuario);
  });
}

const inputUser = document.getElementById('usuario-busqueda');
if (inputUser) {
  inputUser.addEventListener('change', e => {
    let usuario = e.target.value;
    let estado = document.getElementById('estado-buscar').value;
    if(usuario === '') usuario = 'todos';
    datosAlquileres(estado, usuario);
  });
}

const datosAlquileres = async (estado, usuario) => {
  location.href = `/alquileres/buscar/${estado}/${usuario}`;
};

const entregarMoto = async (id, idMoto, idAlquiler) => {
  const res = await fetch(`/alquileres/entregar/${id}`, { 
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({idMoto}),
  });
  const resp = JSON.parse(await res.text());
  resp ? location.reload() : alert('No se puede anticipar la entrega de la moto')
}

const finalizarAlquiler = async (id) => {
  const contenedor = document.getElementById("modal-ubicacion");
  const body = document.querySelector("body");
  contenedor.style.display = "block";
  body.style.overflowY = "hidden";
  document.getElementById("cerrarRegistro-ubicacion").addEventListener("click", () => {
    contenedor.style.display = "none";
    body.style.overflowY = "visible";
  });
  document.getElementById('ubicacion-nueva-moto').addEventListener('click', async () => {
    const ubicacion = document.getElementById('sede-nueva').value;
    if (ubicacion === 'Ubicacion') return alert('Debe seleccionar una sede valida');
    const res = await fetch(`/alquileres/finalizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ubicacion}),
    });
    const resp = JSON.parse(await res.text());
    if(resp) location.reload();
  })
}

// ACCION LINK MOSTRAR DETALLE USUARIO
document
  .querySelectorAll(".ver-user")
  .forEach((e) =>
    e.addEventListener("click", () => verUser(e.getAttribute("moto-id")))
  );

// OBTIENE LOS DATOS DEL USUARIO
const verUser = async (id) => {
  const user = await fetch(`/users/editar/${id}`, {method: 'GET'});
  const res = JSON.parse(await user.text());
  mostraUser(res);
};
// Inserta la Informacion de la moto alquilada
const mostraUser = (res) => {
  const contenedor = document.getElementById("modal-user");
  const body = document.querySelector("body");
  contenedor.style.display = "block";
  body.style.overflowY = "hidden";
  document.getElementById("nombre").innerText = `${res.nombre} ${res.apellido}` ;
  document.getElementById("email").innerText = res.email;
  document.getElementById("telefono").innerText = res.telefono;
  document.getElementById("cerrarRegistro-user").addEventListener("click", () => {
    contenedor.style.display = "none";
    body.style.overflowY = "visible";
  });
};

// ACCION MOTO EN LUGAR DE ENTREGA
document.querySelectorAll('.sedeMoto').forEach( e => {
  e.addEventListener('click', () => { 
    const idMoto = e.getAttribute('moto-alquiler');
    const sedeEntrega = e.getAttribute('sede-entrega');
    const idAlquiler = e.getAttribute("id-alquiler");
    motoEnSede(idMoto, sedeEntrega, idAlquiler);
  });
});
// Envio de datos
const motoEnSede = async (idMoto, sedeEntrega, idAlquiler) => {
  const contenedor = document.getElementById("modal-moto-sede");
  const body = document.querySelector("body");
  contenedor.style.display = "block";
  body.style.overflowY = "hidden";
  document.getElementById("cerrarRegistro-sede").addEventListener("click", () => {
    contenedor.style.display = "none";
    body.style.overflowY = "visible";
  });
  document.getElementById('moto-en-sede').addEventListener('click', async () => {
    const res = await fetch(`/alquileres/motoensede/${idMoto}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({sedeEntrega, idAlquiler}),
    });
    const resp = JSON.parse(await res.text());
    if (resp) {
      location.reload();
    } else {
      alert('El vehiculo tiene entregas en proceso');
      location.reload();
    } 
  })
}