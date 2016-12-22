var _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  describe('1:1 Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Users, Profiles;

    before(function(done) {
      // Check User_resource and Profile have a oneToOne association
      assert.strictEqual(Associations.Profile.attributes.user.model, 'user_resource');
      assert.strictEqual(Associations.User_resource.attributes.profile.model, 'profile');

      Associations.User_resource.createEach([{ name: 'foo1' ,quantity : 1}, { name: 'bar1', quantity : 2 }], function(err, users) {
        assert.ifError(err);

        Associations.User_resource.find({id: [users[0].id, users[1].id]})
        .sort('quantity asc')
        .exec(function(err, users) {
          assert.ifError(err);

          Users = users;

          var profileRecords = [
            { name: 'profile one', user: Users[0].id, level : 1},
            { name: 'profile two', user: Users[1].id, level : 2}
          ];

          Associations.Profile.createEach(profileRecords, function(err, profiles) {
            assert.ifError(err);

            Associations.User_resource.update({ name: 'foo1' }, { profile: profiles[0].id }).exec(function(err, user) {
              assert.ifError(err);

              Associations.User_resource.update({ name: 'bar1' }, { profile: profiles[1].id }).exec(function(err, user) {
                assert.ifError(err);
                Profiles = profiles;
                done();
              });
            });
          });
        });
      });
    });

    describe('.find()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return user when the populate criteria is added on profile', function(done) {
        Associations.Profile.find({id: [Users[0].id, Users[1].id]})
        .sort('level asc')
        .populate('user')
        .exec(function(err, profiles) {
          assert.ifError(err);

          assert(profiles[0].user);
          assert(profiles[1].user);

          assert.equal(profiles[0].user.name, 'foo1');
          assert.equal(profiles[1].user.name, 'bar1');

          done();
        });
      });

      it('should return profile when the populate criteria is added on user', function(done) {
        Associations.User_resource.find({id: [Users[0].id, Users[1].id]})
        .populate('profile')
        .sort('quantity asc')
        .exec(function(err, users) {
          assert.ifError(err);

          assert(users[0].profile);
          assert(users[1].profile);

          assert.equal(users[0].profile.name, 'profile one');
          assert.equal(users[1].profile.name, 'profile two');

          done();
        });
      });

      it('should return a user object when the profile is undefined', function(done) {
        Associations.User_resource.create({ name: 'foobar' }).exec(function(err, usr) {
          assert.ifError(err);

          Associations.User_resource.find({ name: 'foobar' })
          .populate('profile')
          .exec(function(err, users) {
            assert.ifError(err);
            assert(users[0].name);
            assert(!users[0].profile, 'Expected `users[0].profile` to be falsy, but instead users[0] looks like ==> '+require('util').inspect(users[0], false, null));
            done();
          });
        });
      });

      it('should return undefined for profile when the profile is a non-existent foreign key', function(done) {
        Associations.User_resource.create({ name: 'foobar2', profile: '123' }).exec(function(err, usr) {
          assert.ifError(err);
          Associations.User_resource.find({ name: 'foobar2' })
          .populate('profile')
          .exec(function(err, users) {
            assert.ifError(err);
            assert(users[0].name);
            assert(!users[0].profile, 'Expected `users[0].profile` to be falsy, but instead users[0] looks like ==> '+require('util').inspect(users[0], false, null));
            done();
          });
        });
      });

    });

  });
});
