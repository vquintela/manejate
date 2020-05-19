const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const multer = require('multer');

const app = express();
require('./lib/database')

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
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Variables Globales

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/motos', require('./routes/moto'));
app.use('/tareas', require('./routes/tareas'));
app.use('/alquileres', require('./routes/alquiler'));

//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en puerto ${app.get('port')}`)
})