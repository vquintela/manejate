const express = require('express');
const router = express.Router();
const moment = require("moment");
const Alquiler = require('../model/alquiler');

router.get('/', async (req, res) => {
    if(req.user.rol === 'administrador') {
        const alqUsers = await Alquiler.find()
                .or([{ estado: 'pendiente' }, { estado: 'curso' }])
                .populate({path: 'motocicleta', select: 'precio modelo marca ubicacion'})
                .populate({path: 'usuario', select: 'nombre apellido telefono email'})
                .lean();
        const fecha = moment().format('YYYY-MM-DD 00:00:01');
        const count = await Alquiler.countDocuments().where('fechaReserva').gte(fecha);
        res.render('perfil/admin', {
            alquileres: alqUsers,
            count: count
        });
    } else {
        const alqUser = await Alquiler.find()
            .where('usuario').equals(req.user._id)
            .or([{ estado: 'pendiente' }, { estado: 'curso' }])
            .populate({path: 'motocicleta', select: 'precio modelo marca'})
            .lean();
        res.render('perfil/usuario', {
            alquileres: alqUser
        });
    }
})

module.exports = router;