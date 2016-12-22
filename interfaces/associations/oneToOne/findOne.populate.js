var _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  describe('1:1 Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var userRecord, profileRecord;

    before(function(done) {
      // Check User_resource and Profile have a oneToOne association
      assert.strictEqual(Associations.Profile.attributes.user.model, 'user_resource');
      assert.strictEqual(Associations.User_resource.attributes.profile.model, 'profile');

      Associations.User_resource.create({ name: 'foobar' }, function(err, user) {
        assert.ifError(err);

        Associations.Profile.create({ level: 1, user: user.id }, function(err, profile) {
          assert.ifError(err);

          userRecord = user;
          profileRecord = profile;

          done();
        });
      });
    });

    describe('.findOne()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return user_resource when the populate criteria is added', function(done) {
        Associations.Profile.findOne({ id: profileRecord.id })
        .populate('user')
        .exec(function(err, profile) {
          assert.ifError(err);

          assert(profile.user);
          assert.equal(profile.user.id, userRecord.id);
          assert.equal(profile.user.name, 'foobar');

          done();
        });
      });

      it('should not return a user_resource object when the populate is not added', function(done) {
        Associations.Profile.findOne({ id: profileRecord.id })
        .exec(function(err, profile) {
          assert.ifError(err);

          assert(!_.isPlainObject(profile.userRecord));

          done();
        });
      });

      it('should call toJSON on associated record', function(done) {
        Associations.Profile.findOne({ id: profileRecord.id })
        .populate('user')
        .exec(function(err, profile) {
          assert.ifError(err);

          var obj = profile.toJSON();

          assert(!obj.level);
          assert(obj.user);
          assert(obj.user.createdAt);
          assert(!obj.user.name);

          done();
        });
      });
    });

  });
});
