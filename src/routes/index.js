const express = require("express");
const router = express.Router();
const sedeSchema = require("../model/sede");
const motoSchema = require("../model/moto");
const mailer = require("../lib/mailer");

router.get("/", async (req, res) => {
  const data = {};

  data.fechaMinima = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  data.motocicletas = await motoSchema.find().lean();
  data.sedes = await sedeSchema.find().lean();

  res.render("./index", { data });
});

router.get(
  "/obtenerMotos/:rangoPrecios/ubicacion/:ubicacion",
  async (req, res) => {
    const rangoPrecios = req.params.rangoPrecios;
    let motos;
    switch (rangoPrecios) {
      case "1":
        motos = await motoSchema.find({ precio: { $gte: 100, $lte: 200 } });
        break;
      case "2":
        motos = await motoSchema.find({ precio: { $gte: 300, $lte: 500 } });
        break;
      case "3":
        motos = await motoSchema.find({ precio: { $gte: 600, $lte: 1000 } });
        break;
      default:
        motos = await motoSchema.find();
        break;
    }

    const ubicacion = req.params.ubicacion;

    if(ubicacion !== 'all')
      motos = motos.filter(m => m.ubicacion == ubicacion);

    res.json(motos);
  }
);

router.post('/contacto', async (req, res) => {
  const {nombre, contacto, email, comentario} = req.body;
  if (nombre === '' || contacto === '' || email === '' || comentario === '') {
    const error = [];
    if (nombre === '') error.push('nombreEmail: Nombre Incompleto') 
    if (contacto === '') error.push('contactoEmail: Contacto Incompleto') 
    if (email === '') error.push('emailEmail: Email Incompleto') 
    if (comentario === '') error.push('comentarioEmail: Comentario Incompleto') 
    return res.json({error, type: false})
  }
  try {
    await mailer.contacto({nombre, contacto, email, comentario})
    res.json({message: 'Consulta enviada correctamente', type: true})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
