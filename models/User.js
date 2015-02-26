'use strict';

var mongoose = require('mongoose');
var bc = require('bcrypt-nodejs');
var eat = require('eat');

var userSchema = new mongoose.Schema({
  basic: {
    email: String,
    password: String
  },
  username: String
});

userSchema.methods.generateHash = function(pw) {
  return bc.hashSync(pw, bc.genSaltSync(8), null);
};

userSchema.methods.vP = function(pw) {
  return bc.compareSync(pw, this.basic.password);
};

userSchema.methods.generateToken = function(appS, callback) {
  eat.encode({id: this._id, timestamp: new Date()}, appS, callback);
};

userSchema.methods.setProps = function(email, pw) {
  this.basic.email = email;
  this.basic.password = this.generateHash(pw);
};

module.exports = mongoose.model('User', userSchema);
