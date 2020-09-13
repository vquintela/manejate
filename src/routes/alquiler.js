const express = require("express");
const router = express.Router();
const Alquiler = require("../model/alquiler");
const path = require("path");
const errorMessage = require("../lib/errorMessageValidation");
const moment = require("moment");
const { logAdmin, logueado } = require("../lib/auth");
const mailer = require("../lib/mailer");

router.get("/", logAdmin, async (req, res) => {
  moment.locale("es");
  const alquiler = await Alquiler.find().lean().exec();
  const alquileres = [];
  alquiler.map((alq) => {
    alq.fechaEntrega = moment(alq.fechaEntrega).format("l");
    alq.fechaDevolucion = moment(alq.fechaDevolucion).format("l");
    alq.fechaReserva = moment(alq.fechaReserva).format("l");
    alq.fechaCancelacion = moment(alq.fechaCancelacion).format("l");
    alq.rol = req.user.rol;
    alq.cancelable = alq.estado == 'pendiente';
    alquileres.push(alq);
  });
  const estados = Alquiler.schema.path("estado").enumValues;
  res.render("./layouts/alquiler", { alquileres: alquileres, estados: estados });
});

router.post("/nuevo", async (req, res) => {
  if (!req.isAuthenticated()) {
    let mensaje = {
      titulo: "ATENCION",
      cuerpo: "Para realizar alquileres debe ingresar al sistema y registrarse previamente si aún no lo ha hecho.",
    };

    return res.json({ mensaje });
  }

  const fechaReserva = Date.now();

  const entrega = new Date(req.body.fechaEntrega);
  const devolucion = new Date(req.body.fechaDevolucion);

  const a = devolucion.getTime() - entrega.getTime();

  // Validación de fechas de entrega y devolución
  if (entrega > devolucion) {
    let mensaje = {
      titulo: "ERROR",
      cuerpo: "La fecha de entrega no puese ser superior a la de devolución",
    };

    return res.json({ mensaje });
  }

  if ((devolucion.getTime() - entrega.getTime()) / (1000 * 3600 * 24) > 14) {
    let mensaje = {
      titulo: "ATENCION",
      cuerpo:
        "Para alquilar una motocicleta más de dos semanas debe contactarse con la empresa",
    };

    return res.json({ mensaje });
  }

  let alquiler = new Alquiler({
    fechaEntrega: req.body.fechaEntrega,
    fechaDevolucion: req.body.fechaDevolucion,
    motocicleta: req.body.motocicleta,
    usuario: req.user._id, //Agrego para poder seguir con las pruebas
  });

  let mensaje = {
    titulo: "FELICITACIONES",
    cuerpo: "Alquiler realizado correctamente",
  };

  alquiler = await alquiler.save();
  await mailer.reserva(alquiler, req.user);
  res.json({ mensaje, alquiler });
});

router.put("/editar/:id", async (req, res) => {
  const alquiler = await Alquiler.findByIdAndUpdate(
    req.params.id,
    {
      fechaEntrega: req.body.fechaEntrega,
      fechaDevolucion: req.body.fechaDevolucion,
      motocicleta: req.body.motocicleta,
    },
    { new: true }
  );

  if (!alquiler) return status(404);

  res.json(alquiler);
});

router.put("/cancelar/:id", async (req, res) => {
  const alquiler = await Alquiler.findByIdAndUpdate(
    req.params.id,
    {
      estado: 'cancelado'
    }
  );

  res.status(200).send();
});


router.get("/:id", logueado, async (req, res) => {
  moment.locale("es");
  const { id } = req.params;
  const alquiler = await Alquiler.find({ usuario: id }).lean().exec();
  const alquileres = [];
  alquiler.map((alq) => {
    alq.fechaEntrega = moment(alq.fechaEntrega).format("l");
    alq.fechaDevolucion = moment(alq.fechaDevolucion).format("l");
    alq.fechaReserva = moment(alq.fechaReserva).format("l");
    alq.fechaCancelacion = moment(alq.fechaCancelacion).format("l");
    alq.rol = req.user.rol;
    alquileres.push(alq);
  });
  const estados = Alquiler.schema.path("estado").enumValues;
  res.render("./layouts/alquiler", { alquileres: alquileres, estados: estados });
});

module.exports = router;
