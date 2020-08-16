const alquilar = async (data = {}) => {
  const url = "/alquileres/nuevo";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(data),
  });
  return res.json();
};

const createInput = (type, name, classes) => {
  const input = document.createElement("input");
  input.name = name;
  input.type = type;
  if (classes !== undefined) classes.forEach((c) => input.classList.add(c));

  return input;
};

const obtenerDatos = () => {
  const elements = Array.from(
    document.querySelectorAll("#modal-alquiler input")
  );
  const obj = {};
  elements.map((e) => {
    obj[e.name] = e.value;
  });
  return obj;
};

const signin = async () => {
  const email = document.getElementById("email-sgn").value;
  const password = document.getElementById("pass-sgn").value;
  const res = await fetch("/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const resp = await res.json();
  if (resp.type) {
    document.getElementById("error-sgn").innerText = "";
    document.getElementById("true-sgn").innerText = resp.message;
    setTimeout(() => {
      location.reload();
    }, 1500);
  } else {
    document.getElementById("error-sgn").innerText = resp.message;
  }
};

const filtrar = () => {
  const rangoPrecios = document.querySelector("#precio").value;
  const ubicacion = document.querySelector("#ubicacion").value;

  fetch(`/obtenerMotos/${rangoPrecios}/ubicacion/${ubicacion}`)
    .then((res) => res.json())
    .then((json) => refrescar(json));
};

const refrescar = (motocicletas) => {
  const source = $("#motos-template").html();
  const template = Handlebars.compile(source);
  const html = template({ motocicletas: motocicletas });
  $("#moto-card-columns").html(html);
};

const renewPass = async () => {
  const email = document.getElementById("email-sgn").value;
  const res = await fetch("/auth/renew", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const resp = await res.json();
  if (resp.type) {
    document.getElementById("error-sgn").innerText = "";
    document.getElementById("true-sgn").innerText = resp.message;
    setTimeout(() => {
      location.reload();
    }, 1500);
  } else {
    document.getElementById("error-sgn").innerText = resp.message;
  }
};

window.onload = async () => {
  filtrar(); //trae todas las motocicletas al cargar la página

  //registra al evento de mostrar el modal de alquiler la la función de adaptar
  //los datos de dicho modal según la motocicleta
  $("#modal-alquiler").on("show.bs.modal", function (event) {
    const target = $(event.relatedTarget);
    const modal = $(this);
    modal.find(".modal-title").text(`Alquilar ${target[0].innerText}`);
    modal.find("input[name='motocicleta']").val(target[0].id);
  });

  //registra al evento de cliqueo en del botón de alquilar la función de alquilar
  document
    .querySelector("[btn-alquilar]")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const data = obtenerDatos();
      alquilar(data).then((res) => {
        $("#modal-alquiler").modal("hide");
        $("#modal-respuesta .modal-title").text(res.mensaje.titulo);
        $("#modal-respuesta .modal-body").text(res.mensaje.cuerpo);
        $("#modal-respuesta").modal("show");
      });
    });

  //registra el evento de ingreso de usuario
  const btnsgn = document.getElementById("btn-signin");
  if (btnsgn) {
    btnsgn.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.disabled = true;
      signin();
    });
  }

  // Evento de registro de usuario
  const btnSignup = document.getElementById('btn-signup');
  if (btnSignup) {
    btnSignup.addEventListener('click', () => {
      registroUsuario()
    })
  }

  //registra al evento de cambio en los filtros la función de filtrar las motocicletas
  document.addEventListener(
    "change",
    (event) => {
      if (event.target.classList.contains("filtro")) {
        filtrar();
      }
    },
    false
  );

  const btnrnpass = document.getElementById("renew-pass");
  if (btnrnpass) {
    btnrnpass.addEventListener("click", (e) => {
      e.preventDefault();
      renewPass();
    });
  }
};

const registroUsuario = () => {
  const modal = document.querySelector('.contenedor-modal')
  modal.style.display = 'block';
  document.getElementById('cerrarRegistro').addEventListener('click', () => {
    modal.style.display = 'none';
  })
  document.querySelector('.contenido-footer').addEventListener('click', e => {
    if(e.target.classList.contains('cancelar')) {
      modal.style.display = 'none';
    }
    if(e.target.classList.contains('registrarse')) {
      console.log('vfevefvef')
    }
  })
}
