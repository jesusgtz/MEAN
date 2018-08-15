'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.ensureAuth = function(req, res, next) {
	if(!req.headers.auth) {
		return res.status(403).send({
			message: 'No auth header'
		});
	} else {
		var token = req.headers.auth.replace('/[\'"]+/g', '');

		try {
			var payload = jwt.decode(token, secret);

			if(payload.exp <= moment().unix()) {
				return res.status(401).send({
					message: 'Token expired'
				});
			}
		} catch(ex) {
			return res.status(401).send({
				message: 'Invalid token'
			});
		}
		req.user = payload;

		next();
	}
}
