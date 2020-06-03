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
    const motos = await Moto.find();
    res.json(motos)
})

router.post('/insertar', async (req, res) => {
    const { patente, precio, marca, descripcion, modelo } = req.body;
    const moto = new Moto({ patente, precio, marca, descripcion, modelo });
    let resp = null;
    try {
        resp = await moto.save();
    } catch (error) {
        if(req.file){
            await fs.unlink(req.file.path);
        }
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje, redirect: 'error'})
        return;
    }
    if(req.file) {
        const imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${resp._id}${ext}`);

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            await fs.rename(imagePath, targetPath);
            const nombArch = resp._id + ext;
            moto.imagen = nombArch
            await moto.updateOne({imagen: nombArch});
            res.json({message: 'Moto ingresada de forma correcta', css: 'success', redirect: 'remove'});
        } else {
            await fs.unlink(imagePath);
            res.json({message: 'Moto guardada, imagen no soportada', css: 'danger', redirect: 'remove'});
        }
    } else {
        res.json({message: 'Moto ingresada sin imagen', css: 'success', redirect: 'remove'});
    }
})

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const moto = await Moto.findById(id);
    res.json(moto);
})

router.post('/editar/:id', async (req, res) => {
    const { precio, marca, descripcion, modelo, imagen } = req.body;
    if(req.file){
        await fs.unlink(path.resolve('./src/public/img/' + imagen));
        const imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${req.params.id}${ext}`);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            await fs.rename(imagePath, targetPath);
            const imagen = req.params.id + ext;
            try {
                await Moto.findByIdAndUpdate({_id: req.params.id}, { precio, marca, descripcion, modelo, imagen }, { runValidators: true });
                res.json({message: 'Moto actualizada de forma correcta', css: 'success', redirect: 'remove'});
            } catch (error) {
                const mensaje = errorMessage.crearMensaje(error);
                res.json({message: mensaje, redirect: 'error'})
                return;
            }
        } else {
            await fs.unlink(imagePath);
            try {
                await Moto.findByIdAndUpdate({_id: req.params.id}, { precio, marca, descripcion, modelo}, { runValidators: true });
                res.json({message: 'Moto actualizada, imagen no soportada', css: 'danger', redirect: 'remove'});
            } catch (error) {
                const mensaje = errorMessage.crearMensaje(error);
                res.json({message: mensaje, redirect: 'error'})
                return
            }
        }
    } else {
        try {
            await Moto.findByIdAndUpdate({_id: req.params.id}, { precio, marca, descripcion, modelo }, { runValidators: true });
            res.json({message: 'Moto actualizada de forma correcta', css: 'success', redirect: 'remove'});
        } catch (error) {
            const mensaje = errorMessage.crearMensaje(error);
            res.json({message: mensaje, redirect: 'error'})
            return
        }
    }  
})

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { imagen } = req.body;
    if(imagen !== 'sinimagen.png') {
        await fs.unlink(path.resolve('./src/public/img/' + imagen));
    }
    await Moto.findByIdAndDelete(id);
    res.json({message: 'Moto eliminada de forma correcta', css: 'success', redirect: 'remove'});
})

router.put('/estado/:id', async (req, res) => {
    const { id } = req.params;
    const { service } = req.body;
    await Moto.findByIdAndUpdate({_id: id}, { service });
    res.json({message: 'Estado modificado', css: 'success', redirect: 'remove'});
})

module.exports = router