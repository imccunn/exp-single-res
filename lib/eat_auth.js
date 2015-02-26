'use strict';

var eat = require('eat');
var User = require('../models/User');

module.exports = function(appSecret) {
  function resSendMsg(resObj, status, msg) {
    resObj.status(status).send({msg: (msg || 'could not authenticate')});
    return;
  }

  function accessDenied(cond, res) {
    return cond ? resSendMsg(res, 403) : undefined;
  }

  return function(req, res, next) {
    var token = req.headers.eat || req.body.eat;
    accessDenied(!token, res, 'no token found');
    eat.decode(token, appSecret, function(err, decoded) {
      accessDenied(err, res);
      User.findOne({_id: decoded.id}, function(err, user) {
        accessDenied((err || !user), res);
        req.user = user;
        next();
      });
    });
  };
};

