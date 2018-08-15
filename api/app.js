'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var userRoutes = require('./routes/user');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors


//Rutas
app.use('/api', userRoutes);

//Exportar
module.exports = app;
