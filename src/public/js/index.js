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

const getData = () => {
  const elements = Array.from(document.querySelectorAll("#modal-alquiler input"));
  const obj = {};
  elements.map((e) => {
    obj[e.name] = e.value;
  });
  return obj;
};

const signin = async () => {
  const email = document.getElementById('email-sgn').value
  const password = document.getElementById('pass-sgn').value
  const res = await fetch('/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  const resp = await res.json()
  if(resp.type){
    document.getElementById('error-sgn').innerText = ''
    document.getElementById('true-sgn').innerText = resp.message
    setTimeout( () => {
      location.reload()
    }, 1500)
  } else {
    document.getElementById('error-sgn').innerText = resp.message
  }
}

window.onload = async () => {

  $('#modal-alquiler').on('show.bs.modal', function (event) {
    const target = $(event.relatedTarget);
    const modal = $(this)
    modal.find('.modal-title').text(`Alquilar ${target[0].innerText}`);
    modal.find("input[name='motocicleta']").val(target[0].id);
  })

  document.querySelector("[btn-alquilar]").addEventListener("click", (event) => {
      event.preventDefault();
      const data = getData();
      alquilar(data)
        .then((res)=>{
          $('#modal-alquiler').modal('hide')
          $('#modal-respuesta .modal-title').text(res.mensaje.titulo);
          $('#modal-respuesta .modal-body').text(res.mensaje.cuerpo);
          $('#modal-respuesta').modal('show')
        });
  })

  document.getElementById('btn-signin').addEventListener('click', e => {
    if(e.target.classList.contains('signout')) {
      fetch('auth/logout')
    } else {
      e.preventDefault()
      signin()
    }
  })
};
