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
      res.render("./index", { data } );
    });
});

router.get("/obtenerMotos/:rangoPrecios/ubicacion/:ubicacion", (req, res) => {
  const rangoPrecios = req.params.rangoPrecios;
  const ubicacion = req.params.ubicacion;
  const motos = motoSchema.find({ precio: { $gte: 100}, ubicacion: ubicacion });
  res.json(motos);
});

module.exports = router;