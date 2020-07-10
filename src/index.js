const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
require('./lib/database');
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
app.use(multer({dest: path.join(__dirname, 'public/img')}).single('image'));

//Midlewares
app.use(session({
    secret: 'master_car_rental',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
    app.locals.user = req.user;
    app.locals.message = req.flash('message');
    next();
});

//Routes
app.use('/', require('./routes/index'))
app.use('/auth',require('./routes/auth'));
app.use('/users', require('./routes/users'))
app.use('/motos', require('./routes/moto'));
app.use('/tareas', require('./routes/tareas'));
app.use('/sedes', require('./routes/sede'));
app.use('/alquileres', require('./routes/alquiler'));
app.use('/sedes', require('./routes/sede'));

//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en puerto ${app.get('port')}`)
})