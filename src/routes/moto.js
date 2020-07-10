const express = require('express');
const router = express.Router();
const Moto = require('../model/moto')
const path = require('path');
const fs = require('fs-extra');
const errorMessage = require('../lib/errorMessageValidation');

router.get('/', async (req, res) => {
    res.render('./motos/motos')
})

router.get('/todos', async (req, res) => {
    const motos = await Moto.find().populate({path: 'ubicacion', select: 'domicilio'});
    res.json(motos)
})

router.post('/insertar', async (req, res) => {
    const values = req.body;
    const moto = new Moto({ ...values });
    let imagePath
    if(req.file) {
        imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${moto._id}${ext}`);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            await fs.rename(imagePath, targetPath);
            const nombArch = moto._id + ext;
            moto.imagen = nombArch
        } else {
            await fs.unlink(imagePath);
        }
    } 
    try {
        const resp = await moto.save();
        if(resp.imagen !== 'sinimagen.png') {
            res.json({message: 'Moto ingresada de forma correcta', css: 'success', type: true});
        } else {
            res.json({message: 'Moto guardada, imagen no ingresada', css: 'danger', type: true});
        }
    } catch (error) {
        if(moto.imagen !== 'sinimagen.png'){
            await fs.unlink(path.resolve('./src/public/img/' + moto.imagen));
        }
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje, type: false})
        return;
    }
})

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const moto = await Moto.findById(id).populate({path: 'ubicacion', select: 'domicilio'});
    res.json(moto);
})

router.post('/editar/:id', async (req, res) => {
    let { precio, marca, descripcion, modelo, imagen, ubicacion } = req.body;
    if(req.file){
        const imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${req.params.id}${ext}`);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            if(imagen !== 'sinimagen.png'){
                try {
                    await fs.unlink(path.resolve('./src/public/img/' + imagen));
                } catch (error) {
                    res.json({message: 'La imagen no encontrada', css: 'danger', type: true});
                }
            }
            await fs.rename(imagePath, targetPath);
            imagen = req.params.id + ext;
        } else {
            await fs.unlink(imagePath);
        }
    }
    try {
        await Moto.findByIdAndUpdate({_id: req.params.id}, { precio, marca, descripcion, modelo, imagen, ubicacion }, { runValidators: true });
        res.json({message: 'Moto actualizada de forma correcta', css: 'success', type: true});
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje, type: false})
        return
    }
})

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { imagen } = req.body;
    if(imagen !== 'sinimagen.png') {
        try {
            await fs.unlink(path.resolve('./src/public/img/' + imagen));
        } catch (error) {
            res.json({message: 'La imagen no se pudo eliminar', css: 'danger', type: true});
        }
    }
    await Moto.findByIdAndDelete(id);
    res.json({message: 'Moto eliminada de forma correcta', css: 'success', type: true});
})

router.put('/estado/:id', async (req, res) => {
    const { id } = req.params;
    const { service } = req.body;
    await Moto.findByIdAndUpdate({_id: id}, { service: !service });
    res.json({message: 'Estado modificado', css: 'success'});
})

module.exports = router