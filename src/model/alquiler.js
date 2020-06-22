const { Schema, model } = require("mongoose");

module.exports = model(
  "Alquiler",
  new Schema({
    fechaEntrega: {
      type: Date,
      required: true,
      default: Date.now
    },
    fechaDevolucion: {
      type: Date,
      required: true,
      default: Date.now
    },
    fechaReserva: {
      type: Date,
      required: true,
      default: Date.now
    },
    fechaCancelacion: {
      type: Date,
      default: Date.now
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    motocicleta: {
      type: Schema.Types.ObjectId,
      ref: "moto",
    },
    sedeEntrega: {
      type: Schema.Types.ObjectId,
      ref: "sede",
    },
    sedeDevolucion: {
      type: Schema.Types.ObjectId,
      ref: "sede",
    },
  }),
  "alquileres"
);
