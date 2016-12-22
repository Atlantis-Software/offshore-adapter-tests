var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Multiple 1:1 Association', function() {
    describe('create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var profile_1_id, profile_2_id;

      before(function(done) {
        // Check User_resourcemany and Profilemany have a oneToOne association
        assert.strictEqual(Associations.Profilemany.attributes.user.model, 'user_resourcemany');
        assert.strictEqual(Associations.User_resourcemany.attributes.profile.model, 'profilemany');
        assert.strictEqual(Associations.User_resourcemany.attributes.profilePvp.model, 'profilemany');

        Associations.Profilemany.create({ name: 'manyAssociations oneToOne 1 add' }).exec(function(err, profile) {
          assert.ifError(err);
          profile_1_id = profile.id;

          Associations.Profilemany.create({ name: 'manyAssociations oneToOne 2 add' }).exec(function(err, profile) {
            assert.ifError(err);
            profile_2_id = profile.id;
            done();
          });
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create multiple foreign key values when passed association keys', function(done) {
        Associations.User_resourcemany.create({ quantity: 1, profile: profile_1_id, profilePvp: profile_2_id }).exec(function(err, user) {
          assert.ifError(err);
          assert.equal(user.profile.toString(), profile_1_id.toString());
          assert.equal(user.profilePvp.toString(), profile_2_id.toString());
          done();
        });
      });

      it('should populate values only for specified keys', function(done) {

        Associations.User_resourcemany.create({ quantity: 10, profile: profile_1_id, profilePvp: profile_2_id }).exec(function(err) {
          assert.ifError(err);

          Associations.User_resourcemany.findOne({ quantity: 10 })
          .populate('profilePvp')
          .exec(function(err, user) {
            assert.ifError(err);

            var obj = user.toJSON();

            assert(obj.profilePvp);
            assert.equal(obj.profilePvp.id.toString(), profile_2_id.toString());
            assert.equal(obj.profile.toString(), profile_1_id.toString());

            done();
          });
        });
      });
    });
  });

});
