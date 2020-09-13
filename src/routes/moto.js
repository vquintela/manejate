const express = require("express");
const router = express.Router();

const Moto = require("../model/moto");
const errorMessage = require("../lib/errorMessageValidation");
const { logAdmin, logueado } = require("../lib/auth");

router.get("/", logAdmin, async (req, res) => {
  const marcas = Moto.schema.path("marca").enumValues;
  res.render("./motos/motos", { marcas: marcas });
});

router.get("/todos", async (req, res) => {
  const motos = await Moto.find().populate({
    path: "ubicacion",
    select: "domicilio",
  });
  res.json(motos);
});

router.get("/marcas", (req, res) => {
  const marcas = Moto.schema.path("marca").enumValues;
  res.json(marcas);
});

router.post("/insertar", async (req, res) => {
  const values = req.body;
  const moto = new Moto({ ...values });

  try {
    const resp = await moto.save();
    if (resp.imagen !== "https://imgur.com/S1p3HSo.png") {
      res.json({
        message: "Moto ingresada de forma correcta",
        css: "success",
        type: true,
      });
    } else {
      res.json({
        message: "Moto guardada, imagen no ingresada",
        css: "danger",
        type: true,
      });
    }
  } catch (error) {
    const mensaje = errorMessage.crearMensaje(error);
    res.json({ message: mensaje, type: false });
    return;
  }
});

router.get("/editar/:id", logueado, async (req, res) => {
  const { id } = req.params;
  const moto = await Moto.findById(id).populate({
    path: "ubicacion",
    select: "domicilio",
  });
  res.json(moto);
});

router.post("/editar/:id", logAdmin, async (req, res) => {
  let { precio, marca, descripcion, modelo, imagen, ubicacion } = req.body;
  try {
    await Moto.findByIdAndUpdate(
      { _id: req.params.id },
      { precio, marca, descripcion, modelo, imagen, ubicacion },
      { runValidators: true }
    );
    res.json({
      message: "Moto actualizada de forma correcta",
      css: "success",
      type: true,
    });
  } catch (error) {
    const mensaje = errorMessage.crearMensaje(error);
    res.json({ message: mensaje, type: false });
    return;
  }
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Moto.findByIdAndDelete(id);
  res.json({
    message: "Moto eliminada de forma correcta",
    css: "success",
    type: true,
  });
});

router.put("/estado/:id", logAdmin, async (req, res) => {
  const { id } = req.params;
  const { service } = req.body;
  await Moto.findByIdAndUpdate({ _id: id }, { service: !service });
  res.json({ message: "Estado modificado", css: "success" });
});

const subirImagen = (url, options) => {
  const callback = (resolve, reject) => {
    fetch(url, options)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  };
  return new Promise(callback);
};

module.exports = router;
