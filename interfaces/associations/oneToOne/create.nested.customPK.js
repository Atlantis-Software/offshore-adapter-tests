var assert = require('assert');
var _ = require('lodash');
var util = require('util');

describe('Association Interface', function() {

  describe('1:1 Association', function() {

    before(function(done) {
      // Check User_resourcecustom and Profilecustom have a oneToOne association
      assert.strictEqual(Associations.Profilecustom.attributes.user.model, 'user_resourcecustom');
      assert.strictEqual(Associations.User_resourcecustom.attributes.profile.model, 'profilecustom');
      done();
    });

    describe('create nested association when a custom primary key is used', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a parent and child record and store the foreign key on the parent', function(done) {
        var data = {
          number: 1000,
          quantity: 200,
          profile: {
            name: 'oneToOne',
            level: 30
          }
        };

        // Create the Parent and Child records
        Associations.User_resourcecustom.create(data)
        .exec(function(err, user) {
          assert.ifError(err);

          // Ensure the foreignKey get set
          assert.equal(user.profile, 'oneToOne');

          // Look up the values and test that populate works on the custom values
          Associations.User_resourcecustom.findOne(user.number)
          .populate('profile')
          .exec(function(err, _user) {
            assert.ifError(err);

            // Test the parent is correct
            assert.equal(_user.number, 1000);

            // Test the child is correct
            assert.equal(_user.profile.name, 'oneToOne');
            assert.equal(_user.profile.level, 30);

            done();
          });
        });
      });
    });

  });
});
