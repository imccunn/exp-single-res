'use strict';

var express = require('express');
var mongoose = require('mongoose');
var compRoutes = require('./routes/compositionRoutes');
var indexRoute = require('./routes/indexRoute');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/compsApp_dev');

var app = express();
var router = express.Router();

indexRoute(router);
compRoutes(router);

app.use('/api/v1', router);

app.listen(process.env.PORT || 3000, function() {
	console.log('Server listening on port ' + (process.env.PORT || 3000));
});
