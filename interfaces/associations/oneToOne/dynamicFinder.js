var assert = require('assert'),
    _ = require('lodash');

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

          // Cache customer and payment
          userRecord = user;
          profileRecord = profile;

          done();
        });
      });
    });

    describe('dynamic finders', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return user_resource when the dynamic finder method is used for findOne', function(done) {
        Associations.Profile.findOneByUser(userRecord.id)
        .exec(function(err, profile) {
          assert.ifError(err);

          assert(profile.user);
          assert.equal(profile.user.id, userRecord.id);
          assert.equal(profile.user.name, 'foobar');

          done();
        });
      });

      it('should return user_resource when the dynamic finder method is used for find', function(done) {
        Associations.Profile.findByUser(userRecord.id)
        .exec(function(err, profile) {
          assert.ifError(err);

          assert(Array.isArray(profile));
          assert.strictEqual(profile.length, 1);
          assert(profile[0].user);
          assert.equal(profile[0].user.id, userRecord.id);
          assert.equal(profile[0].user.name, 'foobar');

          done();
        });
      });

    });
  });
});
