const alquilar = async (data = {}) => {
  const url = "/alquileres/nuevo";
  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

const createInput = (type, name, classes) => {
  const input = document.createElement("input");
  input.name = name;
  input.type = type;
  if (classes !== undefined) classes.forEach((c) => input.classList.add(c));

  return input;
};

const getData = () => {
  const elements = Array.from(document.querySelectorAll(".modal input"));
  const obj = {};
  elements.map((e) => {
    obj[e.name] = e.value;
  });
  return obj;
};

window.onload = async () => {
  document
  $('.modal').on('show.bs.modal', function (event) {
    const target = $(event.relatedTarget);
    const modal = $(this)
    modal.find('.modal-title').text(`Alquilar ${target[0].innerText}`);
    modal.find("input[name='motocicleta']").val(target[0].id);
  })

  document
    .querySelector("[btn-alquilar]")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      const data = getData();
      await alquilar(data);
    });
};
