'user strict';
var bodyparser = require('body-parser');
var User = require('../models/User');
var eatAuth = require('../lib/eat_auth');

module.exports = function(app, passport, appSecret) {
  
  app.use(bodyparser.json());
  
  app.post('/create_user', function(req, res) {
    var newUser = new User();
    console.log('create user', newUser);
    newUser.setProps(req.body.email, req.body.password);
    // newUser.basic.email = req.body.email;
    // newUser.basic.password = newUser.generateHash(req.body.password);
    newUser.save(function(err, user) {
      if (err) {
        res.status(500).send({msg: 'unable to create user'});
      }
      user.generateToken(appSecret, function(err, token){
        if (err) {
          res.status(500).send({msg: 'unable to create user'});
        }
        res.json({eat: token});
      });
    });
  });

  app.get('/sign_in', passport.authenticate('basic', {session: false}), function(req, res) {
    req.user.generateToken(appSecret, function(err, token) {
      if (err) {
        res.status(500).send({msg: 'could not authenticate'});
        return;
      }
      res.json({eat: token});
    });
  });
};

