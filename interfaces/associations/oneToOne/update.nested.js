var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:1 Association', function() {
    describe('update nested associations()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Profile;

          before(function(done) {
            // Check User_resource and Profile have a oneToOne association
            assert.strictEqual(Associations.Profile.attributes.user.model, 'user_resource');
            assert.strictEqual(Associations.User_resource.attributes.profile.model, 'profile');

            Associations.Profile.create({ level: 1 }).exec(function(err, profile) {
              assert.ifError(err);
              Profile = profile;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new User_resource', function(done) {

            var data = {
              level: 200,
              user: {
                name: 'oneToOne nested 1 update'
              }
            };

            Associations.Profile.update({ id: Profile.id }, data).exec(function(err, profile) {
              assert.ifError(err);

              Associations.Profile.findOne(profile[0].id)
              .populate('user')
              .exec(function(err, profile) {
                assert.ifError(err);
                assert.equal(profile.user.name, 'oneToOne nested 1 update');
                done();
              });
            });
          });
        });


        describe('when association already exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Profile;

          before(function(done) {

            var data = {
              level: 200,
              user: {
                name: 'oneToOne nested 2 update'
              }
            };

            Associations.Profile.create(data).exec(function(err, profile) {
              assert.ifError(err);
              Profile = profile;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var data = {
              level: 100,
              user: {
                name: 'oneToOne nested 2 update - updated'
              }
            };

            Associations.Profile.update({ id: Profile.id }, data).exec(function(err, profile) {
              assert.ifError(err);

              // Look up the profile again to be sure the new user was added
              Associations.Profile.findOne(Profile.id)
              .populate('user')
              .exec(function(err, profile) {
                assert.ifError(err);
                assert.strictEqual(profile.level, 100);
                assert(profile.user);
                assert.equal(profile.user.name, 'oneToOne nested 2 update - updated');
                done();
              });

            });
          });
        });

        describe('when association have primary keys', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Users, Profile;

          before(function(done) {

            Associations.User_resource.create([{ name: 'foo' }, { name: 'bar' }]).exec(function(err, users) {
              assert.ifError(err);
              Users = users;

              Associations.Profile.create({ level: 100, user: users[0].id })
              .exec(function(err, profile) {
                assert.ifError(err);
                Profile = profile;
                done();
              });
            });
          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should update association values', function(done) {

            var data = {
              level: 200,
              user: Users[1]
            };

            Associations.Profile.update({ id: Profile.id }, data).exec(function(err, profiles) {
              assert.ifError(err);

              // Look up the profile again to be sure the user was linked
              Associations.Profile.findOne(profiles[0].id)
              .populate('user')
              .exec(function(err, profile) {
                assert.ifError(err);

                assert.strictEqual(profile.level, 200);
                assert.equal(profile.user.name, 'bar');

                done();
              });

            });
          });
        });

      });
    });
  });
});
