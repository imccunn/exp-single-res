'use strict';

var eat = require('eat');
var User = require('../models/User');

var resSendMsg = function(res, status, msg) {
  res.status(status).send({msg: (msg || 'could not authenticate')});
};

var access = function(cond, res) {
  return cond ? resSendMsg(res, 403) : undefined;
};

module.exports = function(appSecret) {
  return function(req, res, next) {
    var token = req.headers.eat || req.body.eat;
    access(!token, res); 
    eat.decode(token, appSecret, function(err, decoded) {
      access(err, res);
      User.findOne({_id: decoded.id}, function(err, user) {
        access((err || !user), res);
        req.user = user;
        next();
      });
    });
  };
};

