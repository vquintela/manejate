const editarAlquiler = function () {
    console.log(this.attributes['editar-alquiler'].value);
};

const cancelarAlquiler = () => {
    console.log(this.attributes['cancelar-alquiler'].value);
};

const verMoto = async (id) => {
  const motoJSON = await fetch("/motos/editar/" + id, { method: "GET" });
  const res = JSON.parse(await motoJSON.text());
  mostrarMoto(res);
}

const mostrarMoto = (res) => {
  const contenedor = document.querySelector('.contenedor-modal');
  const body = document.querySelector('body');
  contenedor.style.display = 'block';
  body.style.overflowY = 'hidden';
  document.getElementById('marca').innerText = res.marca;
  document.getElementById('modelo').innerText = res.modelo;
  document.getElementById('precio').innerText = res.precio;
  document.getElementById('descripcion').innerText = res.descripcion;
  document.getElementById('ubicacion').innerText = res.ubicacion.domicilio;
  document.getElementById('img-modal').src = res.imagen;
  document.getElementById('cerrarRegistro').addEventListener('click', () => {
    contenedor.style.display = 'none';
    body.style.overflowY = 'visible';
  })
}

document
  .querySelectorAll("[editar-alquiler]")
  .forEach((e) => e.addEventListener("click", editarAlquiler));

document
  .querySelectorAll("[cancelar-alquiler]")
  .forEach((e) => e.addEventListener("click", cancelarAlquiler));


document
  .querySelectorAll('.ver-moto')
  .forEach((e) => e.addEventListener("click", () => verMoto(e.getAttribute('moto-id'))));