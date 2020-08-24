const express = require('express');
const router = express.Router();
const Sede = require('../model/sede');
const errorMessage = require('../lib/errorMessageValidation');
const { logAdmin } = require('../lib/auth');

router.get('/', logAdmin, async (req, res) => {
    res.render('./sedes/sedes');
});

router.get('/todos', async (req, res) => {
    const sedes = await Sede.find();
    res.json(sedes)
})

router.post('/insertar', logAdmin, async (req, res) => {
    const { domicilio, codigoPostal, provincia, ciudad } = req.body;
    const sede = new Sede({ domicilio, codigoPostal, provincia, ciudad });
    let resp = null;
    try {
        resp = await sede.save();
        res.json({ message: "Ingresado con exito", css: 'success', type: true})
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.json({ message: mensaje, type: false })
        return;
    }
})

router.get('/editar/:id', logAdmin, async (req, res) => {
    const sede = await Sede.findById({ _id: req.params.id })
    res.json(sede)

})

router.delete('/delete/:id', logAdmin, async (req, res) => {
    const sede = await Sede.findByIdAndDelete({ _id: req.params.id })
    res.json({ message: "Eliminado con exito", css: 'danger', type: true })

})

router.post('/editar/:id', logAdmin, async (req, res) => {
    const { domicilio, codigoPostal, provincia, ciudad } = req.body;
    try {
        await Sede.findByIdAndUpdate({ _id: req.params.id }, { domicilio, codigoPostal, provincia, ciudad });
        res.json({ message: 'Sede actualizada de forma correcta', css: 'success', type: true });
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.json({ message: mensaje, type: false })
        return
    }
});

module.exports = router