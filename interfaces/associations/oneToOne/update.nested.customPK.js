var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:1 Association', function() {
    describe('update nested associations with custom primary keys()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var User;

          before(function(done) {
            // Check User_resourcecustom and Profilecustom have a oneToOne association
            assert.strictEqual(Associations.Profilecustom.attributes.user.model, 'user_resourcecustom');
            assert.strictEqual(Associations.User_resourcecustom.attributes.profile.model, 'profilecustom');

            var data = {
              number: 100,
              quantity: 200
            };

            Associations.User_resourcecustom.create(data)
            .exec(function(err, user) {
              assert.ifError(err);
              User = user;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new user_resource', function(done) {

            var data = {
              quantity: 200,
              profile: {
                name: 'oneToOne 1 nested',
                level: 50
              }
            };

            Associations.User_resourcecustom.update({ number: User.number })
            .set(data)
            .exec(function(err, user) {
              assert.ifError(err);

              // Check that the foreign key was set
              assert.equal(user[0].profile, 'oneToOne 1 nested');

              Associations.User_resourcecustom.findOne(user[0].number)
              .populate('profile')
              .exec(function(err, user) {
                assert.ifError(err);
                assert.equal(user.profile.name, 'oneToOne 1 nested');
                assert.equal(user.profile.level, 50);
                done();
              });
            });
          });
        });

        describe('when association already exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var User;

          before(function(done) {

            var data = {
              number: 101,
              quantity: 200,
              profile: {
                name: 'oneToOne 2 nested',
                level: 80
              }
            };

            Associations.User_resourcecustom.create(data)
            .exec(function(err, user) {
              assert.ifError(err);
              User = user;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var data = {
              quantity: 100,
              profile: {
                name: 'oneToOne 2 nested - updated',
                level: 90
              }
            };

            Associations.User_resourcecustom.update({ number: User.number })
            .set(data)
            .exec(function(err, users) {
              assert.ifError(err);

              // Check that the foreign key was set
              assert.equal(users[0].profile, 'oneToOne 2 nested - updated');

              // Look up the user again to be sure the new profile was added
              Associations.User_resourcecustom.findOne(User.number)
              .populate('profile')
              .exec(function(err, user) {
                assert.ifError(err);
                assert.equal(user.quantity, 100);
                assert.equal(user.profile.name, 'oneToOne 2 nested - updated');
                assert.equal(user.profile.level, 90);
                done();
              });

            });
          });
        });

      });
    });
  });
});
