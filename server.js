'use strict';

var express = require('express');
var mongoose = require('mongoose');
var compRoutes = require('./routes/compositionRoutes');
var indexRoute = require('./routes/indexRoute');
var userRoutes = require('./routes/userRoutes');
var passport = require('passport');
var uAuth = require('./lib/getUserS');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/compsApp_dev');

var app = express();
app.set('unique', process.env.SECRET || 'changethis');
app.use(passport.initialize());
uAuth(passport);

var genRouter = express.Router();
var compRouter = express.Router();
var userRouter = express.Router();

indexRoute(genRouter);
compRoutes(compRouter, app.get('unique'));

userRoutes(userRouter, passport, app.get('unique'));

var endpoint = {
  dev: '/api/v1'
};

app.use(endpoint['dev'], genRouter);
app.use(endpoint['dev'], userRouter);
app.use(endpoint['dev'], compRouter);

app.listen(process.env.PORT || 3000, function() {
	console.log('Server listening on port ' + (process.env.PORT || 3000));
});
