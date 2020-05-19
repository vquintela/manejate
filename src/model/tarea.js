const { model, Schema } = require('mongoose');
// const reserva = mongoose.model('reserva');

const tareaSchema = new Schema({
    titulo: String,
    descripcion: String,
    avance: [{
        msg: String,
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    id_reserva: {
        type: Schema.Types.ObjectId,
        ref: 'reserva'
    },
    estado: {
        type: Boolean,
        default: false
    },
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = model('tarea', tareaSchema)