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

module.exports = router;