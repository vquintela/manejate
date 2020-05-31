const { Schema, model } = require("mongoose");

module.exports = model(
  "Alquiler",
  new Schema({
    fechaEntrega: {
      type: Date,
      required,
      default: Date.now
    },
    fechaDevolucion: {
      type: Date,
      required,
      default: Date.now
    },
    fechaReserva: {
      type: Date,
      required,
      default: Date.now
    },
    fechaCancelacion: {
      type: Date,
      default: Date.now
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required
    },
    motocicleta: {
      type: Schema.Types.ObjectId,
      ref: "moto",
      required
    },
    sedeEntrega: {
      type: Schema.Types.ObjectId,
      ref: "sede",
    },
    sedeDevolucion: {
      type: Schema.Types.ObjectId,
      ref: "sede",
    },
  })
);
