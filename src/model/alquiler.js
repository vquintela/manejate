const { Schema, model } = require('mongoose');

const alquilerSchema = new Schema({
    fechaEntrega:{
        type: Date
    },
    fechaDevolucion:{
        type: Date
    },
    fechaReserva:{
        type: Date
    },
    fechaCancelacion: {
        type: Date
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    motocicleta: {
        type: Schema.Types.ObjectId,
        ref: 'moto'
    },
    sedeEntrega: {
        type: Schema.Types.ObjectId,
        ref: 'sede'
    },
    sedeDevolucion: {
        type: Schema.Types.ObjectId,
        ref: 'sede'
    },
});

module.exports = model('alquiler', alquilerSchema);