'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req, res) {
	res.status(200).send({message: 'Hola que tal'});
}

function saveMessage(req, res) {
	var params = req.body;

	if(!params.text || !params.receiver) {
		return res.status(200).send({message: 'Envía los datos necesarios'});
	}

	var message = new Message();
	message.emmiter = req.user.sub;
	message.receiver = params.receiver;
	message.text = params.text;
	message.created_at = moment().unix();
	message.viewed = 'false';

	message.save((err, messageStored) => {
		if(err) {
			return res.status(500).send({message: 'Error'});
		}

		if(!messageStored) {
			return res.status(500).send({message: 'Error al enviar'});
		}

		return res.status(200).send({message: messageStored});
	});
}

function getReceivedMessages(req, res) {
	var user_id = req.user.sub;
	var page = 1;
	var itemsPerPage = 4;

	if(req.params.page) {
		page = req.params.page;
	}

	Message.find({receiver: user_id}).populate('emmiter', 'name surname _id image nick').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) {
			return res.status(500).send({message: 'Error'});
		}
		
		if(!messages) {
			return res.status(404).send({message: 'No hay mensajes'});
		}

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
		});	
	});
}

function getUnviewedMessages(req, res) {
	var user_id = req.user.sub;
	
	Message.count({receiver: user_id, viewed: 'false'}).exec((err, count) => {
		if(err) {
			return res.status(500).send({message: 'Error'});
		}
		
		return res.status(200).send({'unviewed': count});
	});
}

function getEmmitMessages(req, res) {
	var user_id = req.user.sub;
	var page = 1;
	var itemsPerPage = 4;

	if(req.params.page) {
		page = req.params.page;
	}

	Message.find({emmiter: user_id}).populate('emmiter receiver', 'name surname _id image nick').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) {
			return res.status(500).send({message: 'Error'});
		}
		
		if(!messages) {
			return res.status(404).send({message: 'No hay mensajes'});
		}

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
		});	
	});
}

module.exports = {
	probando,
	saveMessage,
	getReceivedMessages,
	getEmmitMessages,
	getUnviewedMessages
}
