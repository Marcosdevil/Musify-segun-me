'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
mongoose.connect('mongodb://localhost:27017/Curso_mean_udemy', (err, res) =>{
    if(err){
        throw err;
    }else{
        console.log("La conexión a la base de datos está funcionando correctamente");

        app.listen(port, function(){
            console.log('Servidor del API Rest de niggafy escuchando en http://localhost:'+port);
        });
    }
});