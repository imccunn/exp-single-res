'use strict';

var Comp = require('../models/Composition');
var bodyParser = require('body-parser');
var eatAuth = require('../lib/eat_auth');

module.exports = function(app, appSecret) {
	app.use(bodyParser.json());

	app.get('/comps', eatAuth(appSecret), function(req, res) {
		res.status(200).send({'msg': 'Specify an id to access composition records.'});
	});

	app.get('/comps/:id', eatAuth(appSecret), function(req, res) {
		Comp.find({_id: req.params.id}, function(err, data) {
			if (err) {
				res.status(500).send({'msg': 'Could not retrieve composition.'});
				return;
			}
			res.json(data);
		});
	});

	app.post('/comps', eatAuth(appSecret), function(req, res) {
		var newComp = new Comp(req.body);
		newComp.save(function(err, comp) {
			if (err) {
				res.status(500).send({'msg': 'Could not save composition'});
				return; 
			}
			res.json(comp);
		});
	});

	app.put('/comps/:id', eatAuth(appSecret), function(req, res) {
		var updatedComp = req.body;
		delete updatedComp._id;
		Comp.update({_id: req.params.id}, updatedComp, function(err) {
			if (err) {
				res.status(500).send({'msg': 'Could not update composition.'});
				return;
			}
			res.json(req.body);
		});
	});

	app.delete('/comps/:id', eatAuth(appSecret), function(req, res) {
		Comp.remove({_id: req.params.id}, function(err) {
			if (err) {
				res.status(500).send({'msg': 'Could not remove composition.'});
				return; 
			}
			res.json(req.body);
		});
	});
};
