const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const generate = require('generate-password');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"¡Nombre muy largo maximo 15 caracteres!"]
    },
    apellido: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"¡Apellido muy largo maximo 15 caracteres!"]
    },
    email: { 
        type: String,
        unique: true,
        required: [true, '¡Campo Obligatorio!'],
        validate: {
            validator: (email) => {
                return /\w+@\w+\.+[a-z]/gi.test(email)
            },
            message: '¡Email con formato no valido!'
        }
    },
    telefono: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"¡Telefono muy largo maximo 15 caracteres!"],
        minlength: [8, '¡Telefono muy corto, minimo 8 caracteres!'],
        validate: {
            validator: (telefono) => {
                return /^\d{8,15}$/g.test(telefono)
            },
            message: '¡El telefono solo puede ser numerico!'
        }
    },
    password: {
        type: String,
        required: [true, '¡Campo Obligatorio!']
    },
    rol: {
        type: String,
        enum: {
            values: ['cliente', 'administrador'],
            message: '¡Debe elegir un rol!'
        },
        default: 'cliente'
    },
    numAut: String,
    state: {
        type: Boolean,
        default: false,
        required: true
    },
    img: {
        type: String,
        default: 'avatar.jpg',
        required: true
    }
});

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

userSchema.methods.comparePassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
};

userSchema.methods.genPass = () => {
    return generate.generate({
        length: 10,
        numbers: true
    })
}

userSchema.methods.validatePass = (password) => {
    const expReg = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g;
    return expReg.test(password)
    
}

userSchema.plugin(uniqueValidator, { message: '¡Email en uso elija otro!' });

module.exports = mongoose.model('user', userSchema);