const express = require('express');
const router = express.Router();
const moment = require("moment");
const { where } = require('../model/alquiler');
const Alquiler = require('../model/alquiler');
const MotoSchema = require('../model/moto');
const UserSchema = require('../model/user')
const TareaSchema = require('../model/tarea')

router.get('/', async (req, res) => {
    if(req.user.rol === 'administrador') {
        const fecha = moment().format('YYYY-MM-DD 00:00:01');
        const count = await Alquiler.countDocuments().where('fechaReserva').gte(fecha);
        const motoD = await MotoSchema.countDocuments().where('service').equals(true);
        const cantUser = await UserSchema.countDocuments().where('state').equals(true);
        const cantTarea = await TareaSchema.countDocuments().where('estado').equals(false);
        res.render('perfil/admin', {
            count: count,
            motoD: motoD,
            cantUser: cantUser,
            cantTarea: cantTarea
        });
        
        

    } else {
        const alqUser = await Alquiler.find()
            .where('usuario').equals(req.user._id)
            .or([{ estado: 'pendiente' }, { estado: 'curso' }])
            .populate({path: 'motocicleta', select: 'precio modelo marca'})
            .lean();
        const alquileres = [];
            alqUser.map((alq) => {
              alq.fechaEntrega = moment(alq.fechaEntrega).format("l");
              alq.fechaDevolucion = moment(alq.fechaDevolucion).format("l");
              alq.fechaReserva = moment(alq.fechaReserva).format("l");
              alq.fechaCancelacion = moment(alq.fechaCancelacion).format("l");
              alquileres.push(alq);
            });
        res.render('perfil/usuario', {
            alquileres: alquileres
        });
    }
})

module.exports = router;