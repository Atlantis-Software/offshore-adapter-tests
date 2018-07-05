// TODO: test basic CRUD functionality (semantic interface) at high concurrency

// TODO: measure memory usage
// TODO: measure execution time
// TODO: track any failures/errors


var Offshore = require(process.env.offshorePath || 'offshore');
var Model = require('./support/crud.fixture');
var assert = require('assert');
var asynk = require('asynk');

var CONNECTIONS = 10;

describe('Load Testing', function() {
  this.timeout(60000);


  // TODO: try out `benchmark` library


  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////


  var User;

  before(function(done) {
    var offshore = new Offshore();
    offshore.loadCollection(Model);

    Events.emit('fixture', Model);

    offshore.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      User = colls.loadtest;
      done();
    });
  });


  /////////////////////////////////////////////////////
  // TEST METHODS
  ////////////////////////////////////////////////////


  describe('create with x connection', function() {

    it('should not error', function(done) {

      // generate x users
      var users = [];
      for (var i = 0; i < CONNECTIONS; ++i) {
        users.push({
          first_name: Math.floor((Math.random()*100000)+1),
          last_name: Math.floor((Math.random()*100000)+1),
          email: Math.floor((Math.random()*100000)+1)
        });
      }


      asynk.each(users, function(user, next){
        User.create(user, next);
      }).serie().asCallback(function(err, users) {
        assert.ifError(err);
        assert.strictEqual(users.length, CONNECTIONS);
        done();
      });
    });
  });

});
