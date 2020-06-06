const express = require('express');
const router = express.Router();
const Sede = require('../model/sede');
const path = require('path');
const fs = require('fs-extra');
const errorMessage = require('../lib/errorMessageValidation');

router.get('/', async(req, res) => {
    res.render('./sedes/sedes');
});

router.get('/todos', async (req, res) => {
    const sedes = await Sede.find();
    res.json(sedes)
})

router.post('/insertar', async(req, res) => {
    const { domicilio, codigoPostal, provincia, ciudad} = req.body;
    const sede = new Sede({domicilio, codigoPostal, provincia, ciudad});
    let resp = null;
    try{
        resp = await sede.save();
        res.json({message: "Ingresado con exito"})
        } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje})
        return;
    }
}) 
    router.get('/editar/:id', async (req, res) => {
        const sede = await Sede.findById({_id:req.params.id})
        res.json(sede)
    
    }) 
    router.delete('/delete/:id', async (req, res) => {
        const sede = await Sede.findByIdAndDelete({_id:req.params.id})
        res.json({message: "Eliminado con exito"})

    }) 

    router.post('/editar/:id', async (req, res) => {
    const { domicilio, codigoPostal, provincia, ciudad } = req.body;

        try {
            await Sede.findByIdAndUpdate({_id: req.params.id}, { domicilio, codigoPostal, provincia, ciudad });
            res.json({message: 'Sede actualizada de forma correcta', css: 'success'});
        } catch (error) {
            const mensaje = errorMessage.crearMensaje(error);
            res.json({message: mensaje})
            return
        }
});

module.exports = router