const express = require("express");
const router = express.Router();
const Alquiler = require("../model/alquiler");
const path = require("path");
const errorMessage = require("../lib/errorMessageValidation");

router.get("/", async (req, res) => {
  const alquileres = await Alquiler.find();
  res.render("./alquiler/index", { alquileres: alquileres });
});

router.post("/nuevo", async (req, res) => {
  const fechaReserva = Date.now();

  let alquiler = new Alquiler({
    fechaEntrega: req.body.fechaEntrega,
    fechaDevolucion: req.body.fechaDevolucion,
    motocicleta: req.body.motocicleta,
  });

  const mensaje = {
    titulo: 'FELICITACIONES',
    cuerpo: 'Alquiler realizado correctamente'
  }

  alquiler = await alquiler.save();

  res.json({mensaje, alquiler});
});

router.put('/editar/:id', async (req, res) => {
  const alquiler = await Alquiler.findByIdAndUpdate(
    req.params.id,
    {
      fechaEntrega: req.body.fechaEntrega,
      fechaDevolucion: req.body.fechaDevolucion,
      motocicleta: req.body.motocicleta,
    },
    { new: true }
  );

  if(!alquiler) return status(404);

  res.json(alquiler);
});

router.delete('/eliminar/:id', async (req, res) => {
    const alquiler = await Alquiler.findByIdAndDelete(req.params.id);

    if(!alquiler) return status(404);

    res.json(alquiler);
});

router.get('/:id', async (req, res) => {
    const alquiler = Alquiler.find(req.params.id);

    if(!alquiler) return status(404);

    res.json(alquiler);
});

module.exports = router;
