const editarAlquiler = function () {
    console.log(this.attributes['editar-alquiler'].value);
};

const cancelarAlquiler = () => {
    console.log(this.attributes['cancelar-alquiler'].value);
};

document
  .querySelectorAll("[editar-alquiler]")
  .forEach((e) => e.addEventListener("click", editarAlquiler));

document
  .querySelectorAll("[cancelar-alquiler]")
  .forEach((e) => e.addEventListener("click", cancelarAlquiler));