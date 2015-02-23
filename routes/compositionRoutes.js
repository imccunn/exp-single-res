'use strict';

var Comp = require('../models/Composition');
var bodyParser = require('body-parser');

function statSend(code, msg) {
	return res.statusCode(code).send({'msg' : msg});
}


module.exports = function(app) {
	app.use(bodyParser.json());

	app.get('/comps', function(req, res) {
		res.json({'msg': 'Specify an id to access composition records.'});
	});

	app.get('/comps/:id', function(req, res) {
		Comp.find({_id: req.params.id}, function(err, data) {
			if (err) {
				res.statusCode(500).send({'msg': 'Could not retrieve composition.'});
				return;
			}
			res.json(data);
		});
	});

	app.post('/comps', function(req, res) {
		var newComp = new Comp(req.body);
		newComp.save(function(err, comp) {
			if (err) {
				res.statusCode(500).send({'msg': 'Could not save composition'});
				return; 
			}
			res.json(comp);
		});
	});

	app.put('/comps/:id', function(req, res) {
		var updatedComp = req.body;
		delete updatedComp._id;
		Comp.update({_id: req.params.id}, updatedComp, function(err) {
			if (err) {
				res.statusCode(500).send({'msg': 'Could not update composition.'});
				return;
			}
			res.json(req.body);
		});
	});

	app.delete('/comps/:id', function(req, res) {
		Comp.remove({_id: req.params.id}, function(err) {
			if (err) {
				res.statusCode(500).send({'msg': 'Could not remove composition.'});
				return; 
			}
			res.json(req.body);
		});
	});
};