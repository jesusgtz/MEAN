'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

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
					if(params.gettoken) {
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					} else {
						user.password = undefined;
						return res.status(200).send({user});	
					}
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

function getUser(req, res) {
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if(err) return res.status(500).send({
			message: 'Error en la peticion'
		});

		if(!user) return res.status(404).send({
			message: 'El usuario no existe'
		});

		user.password = undefined;
		return res.status(200).send({user});
	});
}

function getUsers(req, res) {
	var identity_user_id = req.user.sub;

	var page = 1;
	if(req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if(err) return res.status(500).send({
			message: 'Error en la peticion'
		});

		if(!users) return res.status(404).send({
			message: 'No hay usuarios disponibles'
		});

		return res.status(200).send({
			users,
			total,
			pages: Math.ceil(total/itemsPerPage)
		});
	});
}


function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;
	delete update.password;

	if(userId != req.user.sub) {
		return res.status(500).send({
			message: 'No tienes permisos para actualizar usuario'
		});
	}

	User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
		if(err) {
			return res.status(500).send({
				message: 'Error en la peticion'
			});
		}

		if(!userUpdated) {
			return res.status(404).send({
				message: 'No se ha podido actualizar el usuario'
			});
		}

		return res.status(200).send({
			user: userUpdated
		});
	});
}


function uploadImage(req, res) {
	var userId = req.params.id;

	if(req.files) {
		var file_path = req.files.image.path;
		var file_name = file_path.split('\\')[2];
		var file_ext = file_name.split('\.')[1];

		if(userId != req.user.sub) {
			return removeFiles(res, file_path, 'No tienes permisos para cambiar la imagen');
		}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
			User.findByIdAndUpdate(userId, {image:file_name}, {new:true}, (err, userUpdated) => {
				if(err) {
					return res.status(500).send({
						message: 'Error en la peticion'
					});
				}

				if(!userUpdated) {
					return res.status(404).send({
						message: 'No se ha podido actualizar el usuario'
					});
				}

				return res.status(200).send({
					user: userUpdated
				});		
			});
		} else {
			return removeFiles(res, file_path, 'Extension no valida');
		}
	} else {
		return res.status(200).send({
			message: 'No se han subido imagenes'
		});
	}
}


function removeFiles(res, file_path, message) {
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}


function getImageFile(req, res) {
	var image_file = req.params.imageFile;
	var path_file = './uploads/users/' + image_file;

	fs.exists(path_file, (exists) => {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({
				message: 'No existe la imagen'
			});
		}
	});
}

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	uploadImage,
	getImageFile
}
