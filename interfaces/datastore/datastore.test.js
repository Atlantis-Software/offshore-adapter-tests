var assert = require('assert');
var _ = require('lodash');

describe('Datastore Interface', function() {

  var Datastore;

  describe('.get()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {
      Adapter.getDatastore({}, function(err, datastore) {
        Datastore = datastore;
        Datastore.set('user_1', {first_name: 'user1', type: 'test1', age: 10 }, function() {
          Datastore.set('user_2', {first_name: 'user2', type: 'test2', age: 20 }, function() {
            Datastore.set('user_3', {first_name: 'user3', type: 'test3', age: 30 }, function() {
              done();
            });
          });
        });
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////


    it('should get the value from key', function(done) {
      Datastore.get('user_2', function(err, data) {
        assert.ifError(err);
        assert.equal(data.first_name, 'user2');
        assert.equal(data.type, 'test2');
        assert.equal(data.age, 20);
        done();
      });
    });

    it('should return a 404 error if key doesn\'t exist', function(done) {
      Datastore.get('user_36', function(err, data) {
        assert.equal(err.message,'404');
        done();
      });
    });

  });

  describe('.remove()', function() {

    it('should remove a key/value pair', function(done) {
      Datastore.remove('user_2', function() {
        Datastore.get('user_2', function(err, data) {
          assert.equal(err.message,'404');
          done();
        });
      });
    });
    
  });
});
