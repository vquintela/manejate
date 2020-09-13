const editarAlquiler = function () {
    console.log(this.attributes['editar-alquiler'].value);
};

const cancelarAlquiler = () => {
    console.log(this.attributes['cancelar-alquiler'].value);
};

const verMoto = async (id) => {
  const motoJSON = await fetch("/motos/editar/" + id, { method: "GET" });
  const res = await JSON.parse(await motoJSON.text());
  console.log(res)
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