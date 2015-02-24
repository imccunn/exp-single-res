'user strict';
var bodyparser = require('body-parser');
var User = require('../models/User');

module.exports = function(app, passport, appSecret) {
  
  app.use(bodyparser.json());
  
  app.post('/create_user', function(req, res) {
    var newUser = new User();
    newUser.set(req.body.email, req.body.password);
    newUser.save(function(err, usr) {
      if (err) {
        res.status(500).send({msg: 'unable to create user'});
      }
      newUser.generateToken(appSecret, function(err, token){
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

