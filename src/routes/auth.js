const express = require('express')
const router = express.Router()
const passport = require('passport')
const mailer = require('../lib/mailer');
const User = require('../model/user');
const errorMessage = require("../lib/errorMessageValidation");
const { noLogueado, logueado } = require('../lib/auth');

router.post('/signin', noLogueado, (req, res, next) => {
    const { email, password } = req.body
    if(!email.trim()||!password.trim()) return res.json({message: 'Debe completar los campos', type: false});
    passport.authenticate('local-signin', (err, user, info) => { 
        let mens = req.flash();
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.json({message: mens.message, type: false}); 
        }
        req.logIn(user, (err) => {
            if (err) { 
              return next(err); 
            }
            return res.json({message: mens.message, type: true});
        });
    })(req, res, next);
});

router.post('/signup', noLogueado, async (req, res) => {
    const {nombre, apellido, email, telefono, password, verificarPassword} = req.body;
    if(password !== verificarPassword) {
        return res.json({message: 'Las contraseñas no coinciden', passW: true});
    }
    const newUser = new User({nombre, apellido, email, telefono, password});
    if(!newUser.validatePass(password)) {
        return res.json({message: 'Las contraseña no cumple los requisitos', passW: true});
    }
    newUser.password = await newUser.encryptPassword(password);
    newUser.numAut = await newUser.genPass();
    try {
        await newUser.save();
        mailer.signup(newUser.email ,newUser.nombre, newUser.apellido, newUser.numAut);
        return res.json({message: 'Usuario Registrado, verifique su email para terminar', type: true});
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.json({message: mensaje, type: false})
        return;
    }
});

router.get('/verifica', async (req, res) => {
    const {email, id } = req.query;
    const emailUser = await User.findOne({email: email});
    if(!emailUser) {
        res.render('users/verificacion', {valor: false, mensaje: 'Email no registrado'});
    } else {
        if(emailUser.numAut === id) {
            newNum = emailUser.genPass();
            await emailUser.updateOne({state: true, numAut: newNum});
            res.render('users/verificacion', {valor: true, mensaje: `${emailUser.nombre}, ${emailUser.apellido}`});
        } else {
            res.render('users/verificacion', {valor: false, mensaje: 'Autenticación no valida'});;
        }
    }
})

router.post('/renew', async (req, res) => {
    const { email } = req.body;
    if (!email.trim()) return res.json({message: 'Ingrese su email por favor', type: false});
    const user = await User.findOne({email: email});
    if(user) {
        const pass = user.genPass();
        mailer.renew(user.email, user.nombre, user.apellido, pass);
        const password = await user.encryptPassword(pass);
        await user.updateOne({ password: password });
        res.json({message: 'Se le a enviado a su email la nueva password', type: true});
    } else {
        res.json({message: 'Usuario no Registrado, registrese por favor', type: false});
    }
})

router.get('/logout', logueado, (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router