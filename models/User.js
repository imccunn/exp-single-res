'use strict';

var mongoose = require('mongoose');
var bc = require('bcrypt-nodejs');
var eat = require('eat');

var User = new mongoose.Schema({
  basic: {
    email: String,
    password: String
  },
  username: String
});

User.methods.generateHash = function(pw) {
  return bc.hashSync(pw, bc.genSaltSync(8), null);
};

User.methods.vP = function(pw) {
  return bc.compareSync(pw, this.basic.password);
};

User.methods.generateToken = function(appS, callback) {
  eat.encode({id: this._id, timestamp: new Date()}, appSecret, callback);
};

User.methods.set = function(email, pw) {
  this.basic.email = email;
  this.basic.password = this.generateHash(pw);
};

module.exports = mongoose.model('User', User);
