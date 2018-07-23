'use strict'

var User = require('../models/user');

function home(req, res) {
	res.status(200).send({
		message: "Hello World!"
	});
}

function pruebas(req, res) {
	res.status(200).send({
		message: "Pruebas"
	});
}

module.exports = {
	home,
	pruebas
}
