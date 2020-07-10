const express = require("express");
const router = express.Router();
const motoSchema = require("../model/moto");

router.get("/", async (req, res) => {
  motoSchema
    .find()
    .lean()
    .exec((error, result) => {
      const data = {
        "fechaMinima": new Date().toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        "motocicletas": result
      }
      res.render("./index");
    });
});

router.get("/obtenerMotos/:rangoPrecios/ubicacion/:ubicacion", async (req, res) => {
  const rangoPrecios = req.params.rangoPrecios;
  let motos;
  switch(rangoPrecios){
    case "1":
      motos = await motoSchema.find({ precio: { $gte: 100, $lte: 200 }});
      break;
    case "2":
      motos = await  motoSchema.find({ precio: { $gte: 300, $lte: 500 }});
      break;
    case "3":
      motos = await motoSchema.find({ precio: { $gte: 600, $lte: 1000 }});
      break;
  }

  const ubicacion = req.params.ubicacion;
  // motos.find( { ubicacion: ubicacion });
  res.json(motos);
});

module.exports = router;