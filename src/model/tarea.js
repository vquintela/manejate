const { model, Schema } = require('mongoose');
// const reserva = mongoose.model('reserva');

const tareaSchema = new Schema({
    titulo: String,
    descripcion: String,
    avance: String,
    id_reserva: {
        type: Schema.ObjectId,
        ref: 'reserva'
    } ,
    estado: {
        type: Boolean,
        default: false
    }
})

module.exports = model('tarea', tareaSchema)