const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const sedeSchema = new Schema ({
    domicilio: {
        type: String,
        required: [true, '¡Campo Obligatorio!'],
            message: '¡Domicilio incorrecto!'
    },
    codigoPostal: {
        type: String,
        required: [true, '¡Campo requerido!'],
        length: [4, '¡El codigo postal es invalido!'],
    },
    provincia: {
        type: String,
        required: [true, '¡Campo requerido!']
    },
    ciudad: {
        type: String,
        required: [true, '¡Campo requerido!'],
    },

})

sedeSchema.plugin(uniqueValidator, { message: '¡Sede Existente!' });

module.exports = model('sede', sedeSchema);