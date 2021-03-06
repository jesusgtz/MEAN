'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = Schema({
	emmiter: {type: Schema.ObjectId, ref: 'User'},
	receiver: {type: Schema.ObjectId, ref: 'User'},
	text: String,
	created_at: String,
	viewed: String
});

module.exports = mongoose.model('Message', messageSchema);
