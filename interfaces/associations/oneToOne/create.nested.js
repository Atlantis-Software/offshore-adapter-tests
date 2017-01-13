var assert = require('assert');
var _ = require('lodash');
var util = require('util');



describe('Association Interface', function() {

  describe('1:1 Association', function() {

    before(function(done) {
      // Check User_resource and Profile have a oneToOne association
      assert.strictEqual(Associations.Profile.attributes.user.model, 'user_resource');
      assert.strictEqual(Associations.User_resource.attributes.profile.model, 'profile');
      done();
    });

    describe('create nested association', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a parent and child record and store the foreign key on the parent', function(done) {
        var data = {
          quantity: 200,
          profile: {
            name: 'oneToOne nested create'
          }
        };

        Associations.User_resource.create(data).exec(function(err, user) {
          assert.ifError(err);
          assert(user.profile);

          Associations.User_resource.findOne(user.id)
          .populate('profile')
          .exec(function(err, _user) {
            assert(!err,'Tried to execute .findOne() with criteria:\n'+
              util.inspect(_user.id, false, null)+'\nBut got error:\n'+
              util.inspect(err, false, null));
            assert(_user.profile.name === 'oneToOne nested create',
              'Expecting `_user.profile.name`==="oneToOne nested create", but instead `_user` ==>'+
              util.inspect(_user, false, null));
            done();
          });
        });
      });
    });

  });
});
