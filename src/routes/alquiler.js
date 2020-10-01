const express = require("express");
const router = express.Router();
const Alquiler = require("../model/alquiler");
const Moto = require('../model/moto');
const Sede = require('../model/sede');
const path = require("path");
const moment = require("moment");
const { logAdmin, logueado } = require("../lib/auth");
const mailer = require("../lib/mailer");

router.get("/", logAdmin, async (req, res) => {
  moment.locale("es");
  const alquiler = await Alquiler.find().populate({path: 'usuario', select: 'email'}).lean().exec();
  const alquileres = [];
  alquiler.map((alq) => {
    alq.fechaEntrega = moment(alq.fechaEntrega).format("l");
    alq.fechaDevolucion = moment(alq.fechaDevolucion).format("l");
    alq.fechaReserva = moment(alq.fechaReserva).format("l");
    alq.fechaCancelacion = moment(alq.fechaCancelacion).format("l");
    alq.rol = req.user.rol;
    alq.mostrar = req.user.rol == 'administrador'
    // alq.cancelable = alq.estado == 'pendiente';
    alquileres.push(alq);
  });
  const estados = Alquiler.schema.path("estado").enumValues;
  const select = []
  estados.forEach(element => {
    select.push({nombre: element, select: false})
  });
  const sedes = await Sede.find().lean();
  res.render("./layouts/alquiler", { alquileres: alquileres, estados: select, mostrar: req.user.rol == 'administrador', sedes: sedes });
});

router.get("/obtenerFechasReservadas/:id", async (req, res) => {
  const alquileres = await Alquiler.find({ motocicleta: req.params.id }, {_id: 0, fechaEntrega:1, fechaDevolucion:1}).lean().exec();
  res.json(alquileres);
});

router.post("/nuevo", async (req, res) => {
  if (!req.isAuthenticated()) {
    let mensaje = {
      titulo: "ATENCION",
      cuerpo: "Para realizar alquileres debe ingresar al sistema y registrarse previamente si aún no lo ha hecho.",
    };

    return res.json({ mensaje });
  }

  const entrega = moment(req.body.fechaEntrega, "DD/MM/YYYY").toDate();
  const devolucion = moment(req.body.fechaDevolucion, "DD/MM/YYYY").toDate();

  // Validación de fechas de entrega y devolución
  if (entrega > devolucion) {
    let mensaje = {
      titulo: "ERROR",
      cuerpo: "La fecha de entrega no puese ser superior a la de devolución",
    };

    return res.json({ mensaje });
  }

  if ((devolucion - entrega) / (1000 * 3600 * 24) > 14) {
    let mensaje = {
      titulo: "ATENCION",
      cuerpo:
        "Para alquilar una motocicleta más de dos semanas debe contactarse con la empresa",
    };

    return res.json({ mensaje });
  }

  let alquiler = new Alquiler({
    fechaEntrega: entrega,
    fechaDevolucion: devolucion,
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

// router.put("/editar/:id", async (req, res) => {
//   const alquiler = await Alquiler.findByIdAndUpdate(
//     req.params.id,
//     {
//       fechaEntrega: req.body.fechaEntrega,
//       fechaDevolucion: req.body.fechaDevolucion,
//       motocicleta: req.body.motocicleta,
//     },
//     { new: true }
//   );

//   if (!alquiler) return status(404);

//   res.json(alquiler);
// });

router.put("/cancelar/:id", async (req, res) => {
  const alquiler = await Alquiler.findByIdAndUpdate(
    req.params.id,
    {
      estado: 'cancelado'
    }
  );
  res.status(200).json('ok');
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
    // alq.cancelable = alq.estado == 'pendiente';
    alq.usuario.email = req.user.email;
    alq.rol = req.user.rol;
    alquileres.push(alq);
  });
  res.render("./layouts/alquiler", { alquileres: alquileres, mostrar: req.user.rol == 'administrador' });
});

router.get('/buscar/:estado/:usuario', logAdmin, async (req, res) => {
  const estado = req.params.estado;
  const usuario = req.params.usuario;
  let alquiler
  if (estado !== 'todos') {
    alquiler = await Alquiler.find({estado: estado}).populate({path: 'usuario', select: 'email'}).lean().exec();
  } else {
    alquiler = await Alquiler.find().populate({path: 'usuario', select: 'email'}).lean().exec();
  }
  if (usuario !== 'todos') alquiler = alquiler.filter(alq => alq.usuario.email == usuario);
  const alquileres = [];
  alquiler.map((alq) => {
    alq.fechaEntrega = moment(alq.fechaEntrega).format("l");
    alq.fechaDevolucion = moment(alq.fechaDevolucion).format("l");
    alq.fechaReserva = moment(alq.fechaReserva).format("l");
    alq.fechaCancelacion = moment(alq.fechaCancelacion).format("l");
    alq.rol = req.user.rol;
    // alq.cancelable = alq.estado == 'pendiente';
    alquileres.push(alq);
  });
  const estados = Alquiler.schema.path("estado").enumValues;
  const select = []
  estados.forEach(element => {
    if(element === estado) {
      select.push({
        nombre: element,
        select: true
      })
    } else {
      select.push({
        nombre: element,
        select: false
      })
    }
  });
  res.render("./layouts/alquiler", { 
    alquileres: alquileres,
    estados: select,
    usuario: (usuario === 'todos') ? '' : usuario,
    mostrar: req.user.rol == 'administrador'
  });
})

router.put("/entregar/:id", async (req, res) => {
  const alquiler = await Alquiler.findByIdAndUpdate(
    req.params.id,
    {
      estado: 'curso'
    }
  );
  await Moto.findByIdAndUpdate(
    alquiler.motocicleta,
    {
      service: true
    }
  )
  res.status(200).json(true);
});

router.put("/finalizar/:id", async (req, res) => {
  const alquiler = await Alquiler.findByIdAndUpdate(
    req.params.id,
    {
      estado: 'finalizado'
    }
  );
  await Moto.findByIdAndUpdate(
    alquiler.motocicleta,
    {
      service: false,
      ubicacion: req.body.ubicacion
    }
  )
  res.status(200).json(true);
});

module.exports = router;
