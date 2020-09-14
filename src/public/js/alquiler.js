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
  });
}

const verMoto = async (id) => {
  const motoJSON = await fetch("/motos/editar/" + id, { method: "GET" });
  const res = JSON.parse(await motoJSON.text());
  mostrarMoto(res);
};

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