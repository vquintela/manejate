const express = require('express');
const router = express.Router();
const alquiler = require('../model/alquiler');
const path = require('path');
const fs = require('fs-extra');
const errorMessage = require('../lib/errorMessageValidation');

router.get('/', async (req, res) => {
    const alquileres = await alquiler.find();
    res.render('./alquiler/index', { alquileres : alquileres});
});

router.post('/nuevo', async(req, res) => {
    const { fechaEntrega, fechaDevolucion, usuario, motocicleta, sedeEntrega } = req.body;
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

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const alq = await alquiler.findById(id);
    res.json(alq);
});

router.post('/editar/:id', async (req, res) => {
    const { fechaEntrega, fechaDevolucion, fechaReserva, usuario, motocicleta, sedeEntrega } = req.body;

        try {
            await alquiler.findByIdAndUpdate({_id: req.params.id}, { fechaEntrega, fechaDevolucion, fechaReserva, usuario, motocicleta, sedeEntrega });
            res.json({message: 'Alquiler actualizado de forma correcta', css: 'success', redirect: 'remove'});
        } catch (error) {
            const mensaje = errorMessage.crearMensaje(error);
            res.json({message: mensaje, redirect: 'error'})
            return
        }
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await alquiler.findByIdAndDelete(id);
    res.json({message: 'Alquiler eliminado de forma correcta', css: 'success', redirect: 'remove'});
});

module.exports = router