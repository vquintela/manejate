const { model, Schema } = require('mongoose');

const tareaSchema = new Schema({
    titulo: {
        type: String,
        required: [true, '¡Campo requerido!']
    },
    descripcion: {
        type: String, 
        required: [true, '¡Campo requerido!']
    },
    avance: [{}],
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