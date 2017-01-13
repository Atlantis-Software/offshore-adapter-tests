var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:1 Association', function() {
    describe('create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var userId;

      before(function(done) {
        // Check User_resource and Profile have a oneToOne association
        assert.strictEqual(Associations.Profile.attributes.user.model, 'user_resource');
        assert.strictEqual(Associations.User_resource.attributes.profile.model, 'profile');

        Associations.User_resource.create({ name: 'oneToOne add' }).exec(function(err, user) {
          assert.ifError(err);
          userId = user.id;
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a foreign key value when passed an association key', function(done) {
        Associations.Profile.create({ level: 1, user: userId }).exec(function(err, profile) {
          assert.ifError(err);
          assert.equal(profile.user.toString(), userId.toString());
          done();
        });
      });
    });

  });
});
