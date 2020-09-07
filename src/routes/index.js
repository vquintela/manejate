const express = require("express");
const router = express.Router();
const sedeSchema = require("../model/sede");
const motoSchema = require("../model/moto");

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

module.exports = router;
