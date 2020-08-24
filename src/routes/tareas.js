const express = require('express');
const router = express.Router();
const Tareas = require('../model/tarea')
const errorMessage = require('../lib/errorMessageValidation');
const { logAdmin } = require('../lib/auth');

router.get('/', logAdmin, (req, res) => {
    res.render('./tareas/tareas');
})

router.get('/todas', logAdmin, async (req, res) => {
    const tareas = await Tareas.find().select('-avance').populate({path: 'id_user', select: 'nombre apellido'});
    res.json(tareas);
})

router.post('/insertar', logAdmin, async (req, res) => {
    const valores = req.body
    const tarea = new Tareas ({...valores})
    try {
        await tarea.save();
        res.json({message: 'Tarea Ingresada Correctamente', css: 'success', type: true})
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje, type: false})
        return;
    }
})

router.delete('/delete/:id', logAdmin, async (req, res) => {
    const { id } = req.params;
    await Tareas.findByIdAndDelete(id);
    res.json({message: 'Tarea eliminada de forma correcta', css: 'success', type: true});
})

router.get('/editar/:id', logAdmin, async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const tarea = await Tareas.findById(id);
    res.json(tarea);
})

router.post('/editar/:id', logAdmin, async (req, res) => {
    const valores = req.body
    try {
        await Tareas.findByIdAndUpdate({_id: req.params.id}, { ...valores }, { runValidators: true });
        res.json({message: 'Tarea actualizada de forma correcta', css: 'success', type: true});
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje, type: false})
        return;
    }
})

router.put('/estado/:id', logAdmin, async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    await Tareas.findByIdAndUpdate({_id: id}, { estado: state });
    res.json({message: 'Estado modificado', css: 'success', type: true});
})

router.put('/avance/:id', logAdmin, async (req, res) => {
    const { id } = req.params
    const avance = req.body
    let avanceUser = avance.pop()
    avanceUser.nombre = `${req.user.apellido}, ${req.user.nombre}`
    avance.push(avanceUser)
    await Tareas.findByIdAndUpdate({_id: id}, { avance: req.body });
    res.json({message: 'Avance agregado', css: 'success', type: true});
})

router.post('/asignar/:id', logAdmin, async (req, res) => {
    const { id } = req.params
    await Tareas.findByIdAndUpdate({_id: id}, { id_user: req.user._id });
    res.json({message: 'Tarea Asignada', css: 'success', type: true});
})

router.post('/desasignar/:id', logAdmin, async (req, res) => {
    const { id } = req.params
    await Tareas.findByIdAndUpdate({_id: id}, {$unset:{"id_user":""}});
    res.json({message: 'Tarea Desasignada', css: 'success', type: true});
})

module.exports = router