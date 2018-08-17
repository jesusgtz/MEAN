'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res) {
	res.status(200).send({
		message: 'Follows controller'
	});
}

module.exports = {
	prueba
}
