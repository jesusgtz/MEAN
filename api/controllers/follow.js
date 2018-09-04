'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res) {
	var params = req.body;
	var follow = new Follow();

	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((err, followStored) => {
		if (err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

		if(!followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado'});

		return res.status(200).send({follow: followStored});
	});
}

function deleteFollow(req, res) {
	var userId = req.user.sub;
	var followId = req.params.id;

	Follow.find({'user': userId, 'followed': followId}).remove((err) => {
		if (err) return res.status(500).send({message: 'Error al dejar de seguir'});

		return res.status(200).send({message: 'Follow eliminado'});	
	})
}

function getFollowingUsers(req, res) {
	var userId = req.user.sub;
	var page = 1;
	var itemsPerPage = 4;

	if(req.params.id && req.params.page) {
		userId = req.params.id;
	}

	if(req.params.page) {
		page = req.params.page;
	} else {
		page = req.params.id;
	}

	Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
		if(err) return res.status(500).send({message: 'Error al recuperar lista'});
		if(!follows) return res.status(404).send({message: 'No estas siguiendo ningun usuario'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
		});
	});
}

function getFollowedUsers(req, res) {
	var userId = req.user.sub;
	var page = 1;
	var itemsPerPage = 4;

	if(req.params.id && req.params.page) {
		userId = req.params.id;
	}

	if(req.params.page) {
		page = req.params.page;
	} else {
		page = req.params.id;
	}

	Follow.find({followed: userId}).populate({path: 'user'}).paginate(page, itemsPerPage, (err, follows, total) => {
		if(err) return res.status(500).send({message: 'Error al recuperar lista'});
		if(!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
		});
	});
}

module.exports = {
	saveFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedUsers
}
