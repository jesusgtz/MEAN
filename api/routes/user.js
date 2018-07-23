'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();

api.get('/home', userController.home);
api.get('/pruebas', userController.pruebas);

module.exports = api;
