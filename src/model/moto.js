const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const motoSchema = new Schema ({
    patente: {
        type: String,
        required: [true, '¡Campo Obligatorio!'],
        validate: {
            validator: (patente) => {
                return /^[a-z]{3}\d{3}$/gi.test(patente)
            },
            message: '¡Patente con formato no valido!'
        },
        unique: true
    },
    precio: {
        type: Number,
        required: [true, '¡Campo requerido!'],
        min: [0, '¡Solo Valor positivo!'],
        max: [1000000, '¡Valor Exagerado!']
    },
    modelo: {
        type: String,
        required: [true, '¡Campo requerido!'],
        maxlength:[15,"¡Modelo muy largo maximo 15 caracteres!"]
    },
    marca: {
        type: String,
        enum: {
            values: ['honda', 'yamaha', 'zanella', 'beta'],
            message: '¡Debe elegir una marca!'
        },
        required: [true, '¡Campo requerido!']
    },
    descripcion: {
        type: String,
        maxlength:[50,"¡Descripcion muy larga, maximo 50 caracteres!"]
    },
    imagen: {
        type: String,
        default: 'sinimagen.png'
    },
    service: {
        type: Boolean,
        default: false
    },
    ubicacion: {
        type: Schema.Types.ObjectId,
        ref: "sede"
    }
});

motoSchema.plugin(uniqueValidator, { message: '¡Patente en uso ingrese otra!' });

module.exports = model('moto', motoSchema);