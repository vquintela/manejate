const alquilar = async (data = {}) => {
  const url = '/alquiler/nuevo';  
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

window.onload = () => {
  document.querySelectorAll(".card").forEach((value) => {
    value.addEventListener("click", () => {
      Swal.mixin({
        html: '<input type="date"></input>',
        confirmButtonText: "Next &rarr;",
        showCancelButton: true,
        progressSteps: ["1", "2"],
      })
        .queue([
          {
            title: "Fecha de retiro",
            text: "Chaining swal2 modals is easy",
          },
          {
            title: "Fecha de devolución",
            text: "Chaining swal2 modals is easy",
          },
        ])
        .then((result) => {
          if (result.value) {
              alquilar(result.value);
            const answers = JSON.stringify(result.value);
            Swal.fire({
              title: "¡Motocicleta reservada!",
              confirmButtonText: "OK",
            });
          }
        });
    });
  });
};
