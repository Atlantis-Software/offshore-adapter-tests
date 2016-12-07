var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('SKIP LIMIT SORT Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 4 Users
      var users = [];

      users.push({first_name: 'limit_user1', type: 'skip limit sort test', age: 20});
      users.push({first_name: 'limit_user2', type: 'skip limit sort test', age: 25});
      users.push({first_name: 'limit_user3', type: 'skip limit sort test', age: 23});
      users.push({first_name: 'limit_user4', type: 'skip limit sort test', age: 21});
      

      Queryable.User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return the correct records', function(done) {
      Queryable.User.find({ where: { type: 'skip limit sort test' }, limit: 2, skip: 1, sort: 'age desc' }, function(err, users) {
        assert.ifError(err);
        assert(Array.isArray(users));
        assert.strictEqual(users.length, 2);
        assert.strictEqual(users[0].first_name, 'limit_user3');
        assert.strictEqual(users[1].first_name, 'limit_user4');
        done();
      });
    });

  });
});
