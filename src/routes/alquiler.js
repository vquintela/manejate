const express = require("express");
const router = express.Router();
const Alquiler = require("../model/alquiler");
const path = require("path");
const errorMessage = require("../lib/errorMessageValidation");
const moment = require('moment');
const { logAdmin, logueado } = require('../lib/auth');

router.get("/", logAdmin, async (req, res) => {
  moment.locale('es')
  const alquiler = await Alquiler.find().lean().exec();
  const alquileres = []; 
  alquiler.map(alq =>{
    alq.fechaEntrega = moment(alq.fechaEntrega).format('l');
    alq.fechaDevolucion = moment(alq.fechaDevolucion).format('l');
    alq.fechaReserva = moment(alq.fechaReserva).format('l');
    alq.fechaCancelacion = moment(alq.fechaCancelacion).format('l');
    alquileres.push(alq)
  })
  res.render("./layouts/alquiler", { alquileres: alquileres });
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
  const { id } = req.params;
  // Falta que el cliente reserve
  const alquiler = await Alquiler.find({usuario: id});
  console.log('aca')
  res.json(alquiler);
  // if(!alquiler) return status(404);
});

module.exports = router;
