const express = require("express");
const router = express.Router();
const motoSchema = require("../model/moto");

router.get("/", async (req, res) => {
  motoSchema
    .find()
    .lean()
    .exec((error, result) => {
      res.render("./index", { result } );
    });
});

module.exports = router;