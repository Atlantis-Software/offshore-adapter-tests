var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:1 Association', function() {
    describe('Modifiers', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {
        // Check User_resource and Profile have a oneToOne association
        assert.strictEqual(Associations.Profile.attributes.user.model, 'user_resource');
        assert.strictEqual(Associations.User_resource.attributes.profile.model, 'profile');

        var Profiles = [];

        Profiles.push({name: 'modifier1', level: 10000});
        Profiles.push({name: 'modifier2', level: 25000, user: {quantity: 150, name: 'batman'}});
        Profiles.push({name: 'modifier3', level: 32000});
        Profiles.push({name: 'modifier4', level: 25000});

        Associations.Profile.createEach(Profiles, function(err) {
          assert.ifError(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return the correct average', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {average: ['quantity'] })
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.quantity, 150);
          done();
        });
      });

      it('should return the correct min', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {min: ['quantity'] })
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.quantity, 150);
          done();
        });
      });

      it('should return the correct max', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {max: ['quantity'] })
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.quantity, 150);
          done();
        });
      });

      it('should return the correct sum', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {sum: ['quantity'] })
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.quantity, 150);
          done();
        });
      });

      it('should return records with contains modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {name: {contains: 'at'}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with endsWith modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {name: {endsWith: 'man'}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with greaterThan modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {quantity: {greaterThan: 120}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.quantity, 150);
          done();
        });
      });

      it('should return records with in modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {name: ['batman', 'daredevil']})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with lessThan modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {quantity: {lessThan: 300}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with like modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {name: {like: '%at%man'}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with limit modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {quantity: 150, limit: 1})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with not modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {quantity: {'!': 180}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with notIn modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {name: { '!': ['aquaman', 'daredevil']}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with or modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {where: { or: [{name:'batman'}, {quantity: 230}]}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

      it('should return records with select modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {quantity: 150, select: ['name']})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          assert.strictEqual(Profiles[0].user.quantity, undefined);
          done();
        });
      });

      it('should return records with skip modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {quantity: 150, skip: 1})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert.strictEqual(Profiles[0].user, void 0, 'customer should be skipped');
          done();
        });
      });

      it('should return records with startsWith modifier', function(done) {
        Associations.Profile.find({ where: { name: 'modifier2' }})
          .populate('user', {name: {startsWith: 'bat'}})
          .exec(function(err, Profiles) {
          assert.ifError(err);
          assert(Array.isArray(Profiles));
          assert.strictEqual(Profiles.length, 1);
          assert.strictEqual(Profiles[0].name, 'modifier2');
          assert(_.isObject(Profiles[0].user));
          assert.strictEqual(Profiles[0].user.name, 'batman');
          done();
        });
      });

    });
  });
});
