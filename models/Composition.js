'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var compositionSchema = new Schema({
	title: String,
	year: {type: Number, default: new Date().getFullYear()},
	composer: {type: String, default: 'Anonymous'}
});

module.exports = mongoose.model('Comp', compositionSchema);
