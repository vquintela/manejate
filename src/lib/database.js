const mongoose = require('mongoose');

//Direccion db
const direccion = "mongodb://127.0.0.1:27017/manejate";

mongoose.connect(direccion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(db => console.log('DB conectada'))
.catch(err => console.log(err));