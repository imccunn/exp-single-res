'use strict';

var BStrat = require('passport-http').BasicStrategy,
    User = require('../models/User');

module.exports = function(passport) {
  passport.use('basic', new BStrat({}, function(email, p, done) {
    User.findOne({'basic.email': email}, function(err, user) {
      if (err) {
        done('could not authenticate');
        return;
      }
      if (!user) {
        done('could not authenticate');
        return;
      }
      if (!user.validPassword(p)) {
        done('could not authenticate');
        return;
      }
      return done(null, user);
    });
  }));
};
