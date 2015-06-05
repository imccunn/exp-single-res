'use strict';

process.env.MONGO_URI = 'mongodb://localhost/compsApp_test';
require('../server.js');
var mongoose = require('mongoose');	
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);

var server = 'localhost:3000/api/v1';

describe('Composition DB, API endpoints', function() {

	describe('user Routes creates a user', function() {
		it('should create a user', function(done) {
			chai.request(server)
				.post('/create_user')
				.send({email: 'neat@aol.com', password: 'neat'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res).to.have.status(200);
					expect(res.body).to.have.property('eat');
					done();
				});
		});
	});
	
  describe('composition route specific request tests', function() {
		
		after(function(done) {
			mongoose.connection.db.dropDatabase(function() {
				done();
			});
		});
		
    var eat;
		before(function(done) {
			chai.request(server)
				.post('/create_user')
				.send({email: 'test@email.com', password: 'neat'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res).to.have.status(200);
					expect(res.body).to.have.property('eat');
					eat = res.body.eat;
					done();
				});
		});
		it('comps resource has an index', function(done) {
			chai.request(server)
				.get('/comps')
				.send({eat: eat})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res).to.have.status(200);
					expect(res.body.msg).to.eql('Specify an id to access composition records.');
					done();
				});
		});

		it('responds to post requests', function(done) {
			chai.request(server)
				.post('/comps')
				.send({eat: eat, title: 'String Quartet no. 5', year: 2000, composer: 'Ian McCunn'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body).to.have.property('_id');
					expect(res.body.title).to.eql('String Quartet no. 5');
					expect(res.body.year).to.eql(2000);
					expect(res.body.composer).to.eql('Ian McCunn');	
					done();
				});
		});

		it('post request without all values should manifest default values', function(done) {
			chai.request(server)
				.post('/comps')
				.send({eat: eat, title: 'Primordial Sol'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.year).to.eql(2015);
					expect(res.body.composer).to.eql('Anonymous');
					done();
				});
		});

		describe('requests with data already in database', function() {
			var year = new Date().getFullYear();
			var id;
			beforeEach(function(done) { // jshint ignore: line
				chai.request(server)
					.post('/comps')
					.send({eat: eat, title: 'String Quartet no 5', year: year, composer: 'Bob'})
					.end(function(err, res) {
						id = res.body._id;
						done();
					});
			});

			it('responds to get requests by id', function(done) {
				chai.request(server)
					.get('/comps/' + id)
					.send({eat: eat})
					.end(function(err, res) {
						expect(err).to.eql(null);
						expect(res).to.have.status(200);
						expect(Array.isArray(res.body)).to.be.true; // jshint ignore: line
						expect(res.body[0]).to.have.property('title');
						expect(res.body[0]).to.have.property('year');
						expect(res.body[0]).to.have.property('composer');
						done();
					});
			});

			it('responds to put requests', function(done) {
				chai.request(server)
					.put('/comps/' + id)
					.send({eat: eat, title: 'String Quartet no. 9', year: year, composer: 'Bob'})
					.end(function(err, res) {
						expect(err).to.eql(null);
						expect(res).to.have.status(200);
						expect(res.body.title).to.eql('String Quartet no. 9');
						done();
					});
			});

			it('responds to delete requests', function(done) {
				chai.request(server)
					.delete('/comps/' + id)
					.send({eat: eat})
					.end(function(err, res) {
						expect(err).to.eql(null);
						expect(res).to.have.status(200);
						done();
					});
			});
		});
	});

	describe('requests to index route', function() {
		it('has an appropriate response to a get request', function(done) {
			chai.request(server)
				.get('/')
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res).to.have.status(200);
					done();
				});
		});
	});
});
