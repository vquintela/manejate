const getMotos = async () => {
  const userJSON = await fetch("motos/todos", { method: "GET" });
  return JSON.parse(await userJSON.text());
};

const eliminarMoto = async (id, image) => {
  const data = {};
  data.imagen = image;
  const dataJSON = JSON.stringify(data);
  const resp = await fetch("/motos/delete/" + id, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: dataJSON,
  });
  return JSON.parse(await resp.text());
};

const changeState = async (id, service) => {
  const body = {};
  body.service = JSON.parse(service);
  const motoJSON = JSON.stringify(body);
  const add = await fetch("/motos/estado/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: motoJSON,
  });
  return JSON.parse(await add.text());
};

const insertarMoto = async (id, imagen) => {
  let formData = new FormData();

  formData.append("modelo", document.getElementById("modelo").value);
  const ubicacion = document.getElementById("ubicacion").value;

  if (ubicacion !== "Ubicacion")
    formData.append("ubicacion", document.getElementById("ubicacion").value);

  formData.append("descripcion", document.getElementById("descripcion").value);
  formData.append("marca", document.getElementById("marca").value);
  formData.append("precio", document.getElementById("precio").value);
  formData.append("patente", document.getElementById("patente").value);

  if (document.getElementById("imagen").files[0]) {
    const imageData = new FormData();
    imageData.append("image", document.getElementById("imagen").files[0]);

    const CLIENT_ID = "eebc1228df88a58";

    await subirImagen(`https://api.imgur.com/3/image`, {
      method: "POST",
      body: imageData,
      headers: {
        Authorization: `Client-ID ${CLIENT_ID}`,
      },
    }).then((data) => {
      formData.append("imagen", data.data.link);
    });
  } else if (imagen) {
    if (imagen) formData.append("imagen", imagen);
  }

  if (id) {
    const text = await fetch("/motos/editar/" + id, {
      method: "POST",
      body: formData,
    });
    return JSON.parse(await text.text());
  } else {
    const text = await fetch("/motos/insertar", {
      method: "POST",
      body: formData,
    });
    return JSON.parse(await text.text());
  }
};

const subirImagen = async (url, options) => {
  const res = await fetch(url, options);
  return res.json();
};

const getmoto = async (id) => {
  const motoJSON = await fetch("/motos/editar/" + id, { method: "GET" });
  return JSON.parse(await motoJSON.text());
};

const getSedes = async () => {
  const sedes = await fetch("/sedes/todos", { method: "GET" });
  return JSON.parse(await sedes.text());
};

const getMarcas = async () => {
  const marcas = await fetch("/motos/marcas", { method: "GET" });
  return JSON.parse(await marcas.text());
}

export { getMotos, eliminarMoto, changeState, insertarMoto, getmoto, getSedes, getMarcas };
