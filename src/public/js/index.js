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
    document.getElementById("btn-signin").disabled = false;
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

const bloquearFechasReservadas = (id) => {
  fetch(`/alquileres/obtenerFechasReservadas/${id}`)
  .then(res => res.json().then(data => {
    let fechasReservadas = data.flatMap(x => [moment(x.fechaEntrega), moment(x.fechaDevolucion)]);

    $('#fechaEntrega').datetimepicker("destroy");
    $('#fechaEntrega').datetimepicker({
      format: 'L',
      locale: 'es',
      disabledDates: fechasReservadas
    });

    $('#fechaDevolucion').datetimepicker("destroy");
    $('#fechaDevolucion').datetimepicker({
      format: 'L',
      locale: 'es',
      disabledDates: fechasReservadas
    });
  }));
}

window.onload = async () => {

  filtrar(); //trae todas las motocicletas al cargar la página

  //registra al evento de mostrar el modal de alquiler la la función de adaptar
  //los datos de dicho modal según la motocicleta
  $("#modal-alquiler").on("show.bs.modal", function (event) {
    const target = $(event.relatedTarget);
    bloquearFechasReservadas(target[0].id);
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

  document.getElementById('contactar').addEventListener('click', e => {
    e.preventDefault();
    contacto();
  })

  //ANIMACION BTN SIDEBAR
  const btnSidebar = document.getElementById('btn-sidebar');
  if (btnSidebar) btnSidebar.addEventListener('click', () => {
    document.querySelector('.sidebar-index').classList.toggle('show-sidebar');
  })
};

const registroUsuario = () => {
  const modal = document.querySelector('.contenedor-modal')
  modal.style.display = 'block';
  document.querySelector('body').style.overflowY = 'hidden';
  document.getElementById('cerrarRegistro').addEventListener('click', () => {
    modal.style.display = 'none';
    document.querySelector('body').style.overflowY = 'visible';
  })
  document.querySelector('.contenido-footer').addEventListener('click', e => {
    if (e.target.classList.contains('cancelar')) {
      modal.style.display = 'none';
      document.querySelector('body').style.overflowY = 'visible';
    }
    if (e.target.classList.contains('registrarse')) {
      registrar()
    }
  })
}

const registrar = async () => {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;
  const password = document.getElementById('password').value;
  const verificarPassword = document.getElementById('verificar-password').value;

  const add = await fetch('auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, apellido, email, telefono, password, verificarPassword })
  });
  const res = JSON.parse(await add.text());
  if (res.type) {
    document.querySelector('.contenedor-modal').style.display = 'none';
    mensajeOk(res.message)
  } else if (res.passW) {
    document.getElementById('passW').innerText = res.message;
  } else {
    mensajeError(res.message)
  }
}

const mensajeError = (errors) => {
  document.querySelectorAll('.text-danger').forEach(span => span.innerText = '');
  errors.forEach(error => {
    const [key, value] = error.split(':').map(err => err.trim())
    document.getElementById(`${key}Error`).innerText = value
  })
}

const mensajeOk = (message) => {
  let mascara = document.getElementById('lamascara');
  mascara.style.display = "block";
  document.getElementById('titulo-modal').innerText = 'USUARIO REGISTRADO';
  document.querySelector('#panelResultados').innerText = message;
  const btnCerrar = document.getElementById('cerrarModal');
  btnCerrar.addEventListener("click", () => {
    document.getElementById('lamascara').style.display = "none";
  });
  const btnAceptar = document.getElementById('aceptarModal');
  btnAceptar.addEventListener("click", () => {
    document.getElementById('lamascara').style.display = "none";
  });
}

const contacto = async () => {
  const nombre = document.getElementById('nombreEmail').value;
  const contacto = document.getElementById('contactoEmail').value;
  const email = document.getElementById('emailEmail').value;
  const comentario = document.getElementById('comentarioEmail').value;
  const res = await fetch("/contacto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, contacto, email, comentario })
  });
  const resp = JSON.parse(await res.text());
  if (resp.type) {
    mensajeOk(resp.message);
    document.getElementById('form-contacto').reset();
  } else {
    mensajeError(resp.error)
  }
}