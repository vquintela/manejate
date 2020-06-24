const express = require('express')
const router = express.Router()
const passport = require('passport')

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

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router