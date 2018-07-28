'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

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

function saveUser(req, res) {
	var params = req.body;
	var user = new User();

	if(params.name && params.surname && params.nick && params.email 
		&& params.password) {

		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		//Control de usuarios duplicados
		User.find({$or : [
							{email: user.email.toLowerCase()},
							{nick: user.nick.toLowerCase()}
						]
				}).exec((err, users) => {
					if(err) { 
						return res.status(500).send({
							message: 'Error al guardar el usuario'
						});
					}

					if(users && users.length >= 1) {
						return res.status(200).send({
							message: 'El usuario ya existe'
						});
					} else {
						//Cifra la constraseña e inserta usuario
						bcrypt.hash(params.password, null, null, (err, hash) => {
							user.password = hash;

							user.save((err, userStored) => {
								if(err) { 
									return res.status(500).send({
										message: 'Error al guardar el usuario'
									});
								}

								if(userStored) {
									res.status(200).send({
										user: userStored
									});
								} else {
									res.status(404).send({
										message: 'No se ha registrado el usuario'
									})
								}
							});
						});
					}	
				});
	} else {
		res.status(200).send({
			message: 'Envía los campos obligatorios'
		});
	}
}

function loginUser(req, res) {
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err, user) => {
		if(err) return res.status(500).send({
			message: 'Error en la peticion'
		});

		if(user) {
			bcrypt.compare(password, user.password, (err, check) => {
				if(check) {
					//devolver datos de usuario. TODO: tokens
					return res.status(200).send({user});
				} else {
					return res.status(404).send({
						message: 'El usuario no se ha podido identificar'
					});
				}
			});
		} else {
			return res.status(404).send({
				message: 'El usuario no esta registrado'
			});
		}
	})	
}


module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser
}
