const express = require('express');
const router = express.Router();
const alquiler = require('../model/alquiler');
const path = require('path');
const fs = require('fs-extra');
const errorMessage = require('../lib/errorMessageValidation');

router.get('/', async(req, res) => {
    res.render('./alquiler/index');
});

router.post('/nuevo', async(req, res) => {
    const { fechaEntrega, fechaDevolucion, fechaReserva, usuario, motocicleta, sedeEntrega } = req.body;
    const alquiler = new alquiler({fechaEntrega, fechaDevolucion, fechaReserva, usuario, motocicleta, sedeEntrega});
    let resp;
    try{
        resp = await alquiler.save();
    } catch (error) {
        if(req.file){
            await fs.unlink(req.file.path);
        }
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje, redirect: 'error'})
        return;
    }
});


module.exports = router