'use strict';

var eat = require('eat');
var User = require('../models/User');

module.exports = function(appSecret) {

  return function(req, res, next) {
    var token = req.headers.eat || req.body.eat;
    if (!token) {
      res.status(403).send({msg: 'no token'});
      return;
    }
    eat.decode(token, appSecret, function(err, decoded) {
      if (err) {
        res.status(403).send({msg: 'unable to decode'});
        return;
      }
      User.findOne({_id: decoded.id}, function(err, user) {
        if (err || !user) {
          res.status(403).send({msg: 'user not found'});
        }
        req.user = user;
        next();
      });
    });
  };
};
