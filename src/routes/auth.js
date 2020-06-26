const express = require('express')
const router = express.Router()
const passport = require('passport')
const mailer = require('../lib/mailer');
const User = require('../model/user')

router.post('/signin', (req, res, next) => {
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

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router