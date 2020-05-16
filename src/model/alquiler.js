const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    motocicleta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moto'
    },
    sedeEntrega: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sede'
    },
    sedeDevolucion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sede'
    },
});

module.exports = model('alquiler', alquilerSchema);