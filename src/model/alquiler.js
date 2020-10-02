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
    estado: {
      type: String,
      enum: {
          values: ['pendiente', 'curso', 'finalizado', 'cancelado'],
          message: '¡Debe elegir un estado!'
      },
      default: 'pendiente'
    }
  }),
  "alquileres"
);
