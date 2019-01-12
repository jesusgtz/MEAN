'use strict'

var express = require('express');
var publicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications' });

api.get('/prueba-pub', md_auth.ensureAuth, publicationController.prueba);
api.post('/publication', md_auth.ensureAuth, publicationController.savePublication);

module.exports = api;
