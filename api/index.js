'use strict'

var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean')
	.then(() => {
		console.log("Connected to mean db");
	})
	.catch(err => console.log(err));
