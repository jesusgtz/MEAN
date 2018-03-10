'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
app.get('/', (req, res) => {
	res.status(200).send({
		message: "Hello World!"
	});
});

app.get('/pruebas', (req, res) => {
	res.status(200).send({
		message: "Pruebas"
	});
});

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors


//Rutas


//Exportar
module.exports = app;
