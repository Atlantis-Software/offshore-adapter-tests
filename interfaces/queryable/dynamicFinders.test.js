var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var userRecords;

  before(function(done) {
    var users = [
      { first_name: 'dynamic finders bar', last_name: 'smith'},
      { first_name: 'dynamic finders foobar', last_name: 'smith' },
      { first_name: 'dynamic finders foo', last_name: 'john' }
    ]

    Queryable.User.createEach(users, function(err, users) {
      assert.ifError(err);

      // Cache user
      userRecords = users;
      done();
    });
  });

  describe('dynamic finders', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return customer when the dynamic finder method is used for findOne', function(done) {
      Queryable.User.findOneByFirst_name(userRecords[0].first_name)
      .exec(function(err, user) {
        assert.ifError(err);

        assert(user);
        assert.equal(user.id, userRecords[0].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for findOneIn', function(done) {
      Queryable.User.findOneByFirst_nameIn([userRecords[0].first_name, userRecords[1].first_name]).sort('first_name asc')
      .exec(function(err, user) {
        assert.ifError(err);

        assert(user);
        assert.equal(user.id, userRecords[0].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for findOneLike', function(done) {
      Queryable.User.findOneByFirst_nameLike('%bar').sort('first_name asc')
      .exec(function(err, user) {
        assert.ifError(err);

        assert(user);
        assert.equal(user.id, userRecords[0].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for find', function(done) {
      Queryable.User.findByFirst_name(userRecords[0].first_name)
      .exec(function(err, users) {
        assert.ifError(err);

        assert.strictEqual(users.length, 1);
        assert.equal(users[0].id, userRecords[0].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for findIn', function(done) {
      Queryable.User.findByFirst_nameIn([userRecords[0].first_name, userRecords[1].first_name]).sort('first_name asc')
      .exec(function(err, users) {
        assert.ifError(err);

        assert.strictEqual(users.length, 2);
        assert.equal(users[0].id, userRecords[0].id);
        assert.equal(users[1].id, userRecords[1].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for findLike', function(done) {
      Queryable.User.findByFirst_nameLike('%bar').sort('first_name asc')
      .exec(function(err, users) {
        assert.ifError(err);

        assert.strictEqual(users.length, 2);
        assert.equal(users[0].id, userRecords[0].id);
        assert.equal(users[1].id, userRecords[1].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for count', function(done) {
      Queryable.User.countByLast_name('smith')
      .exec(function(err, userCount) {
        assert.ifError(err);

        assert.strictEqual(userCount, 2);
        done();
      });
    });

    it('should return customer when the dynamic finder method is used for countIn', function(done) {
      Queryable.User.countByLast_nameIn(['smith', 'john'])
      .exec(function(err, userCount) {
        assert.ifError(err);

        assert.strictEqual(userCount, 3);
        done();
      });
    });

    it('should return customer when the dynamic finder method is used for countLike', function(done) {
      Queryable.User.countByFirst_nameLike('%bar')
      .exec(function(err, userCount) {
        assert.ifError(err);

        assert.strictEqual(userCount, 2);
        done();
      });
    });

    it('should return customer when the dynamic finder method is used for startsWith', function(done) {
      Queryable.User.first_nameStartsWith('dynamic').sort('first_name asc')
      .exec(function(err, users) {
        assert.ifError(err);

        assert.strictEqual(users.length, 3);
        assert.equal(users[0].id, userRecords[0].id);
        assert.equal(users[1].id, userRecords[2].id);
        assert.equal(users[2].id, userRecords[1].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for startsWith', function(done) {
      Queryable.User.first_nameContains('bar').sort('first_name asc')
      .exec(function(err, users) {
        assert.ifError(err);

        assert.strictEqual(users.length, 2);
        assert.equal(users[0].id, userRecords[0].id);
        assert.equal(users[1].id, userRecords[1].id);

        done();
      });
    });

    it('should return customer when the dynamic finder method is used for startsWith', function(done) {
      Queryable.User.first_nameEndsWith('bar').sort('first_name asc')
      .exec(function(err, users) {
        assert.ifError(err);

        assert.strictEqual(users.length, 2);
        assert.equal(users[0].id, userRecords[0].id);
        assert.equal(users[1].id, userRecords[1].id);

        done();
      });
    });

  });
});
