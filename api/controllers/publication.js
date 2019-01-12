'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res) {
	return res.status(200).send({
		message: "Hello from publication controller"
	});
}

module.exports = {
	prueba
};
