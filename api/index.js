'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

//Conexion a base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean')
	.then(() => {
		console.log("Connected to mean db");

		//Crear servidor
		app.listen(port, () => {
			console.log("Running server at http://localhost:3000");
		});
	})
	.catch(err => console.log(err));
