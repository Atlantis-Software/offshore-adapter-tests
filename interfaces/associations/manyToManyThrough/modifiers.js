var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('HasManyThrough Association', function() {
    describe('Modifiers', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {
        // Check Stadium hasManytoMany Team through Venue
        assert.strictEqual(Associations.Stadium.attributes.teams.collection, 'team');
        assert.strictEqual(Associations.Team.attributes.stadiums.collection, 'stadium');
        assert.strictEqual(Associations.Venue.attributes.stadium.model, 'stadium');
        assert.strictEqual(Associations.Venue.attributes.team.model, 'team');

        var Stadiums = [];

        Stadiums.push({name: 'modifier1', budget: 10000, teams: []});
        Stadiums.push({name: 'modifier2', budget: 25000, teams: []});
        Stadiums.push({name: 'modifier3', budget: 32000, teams: []});
        Stadiums.push({name: 'modifier4', budget: 25000, teams: []});

        Stadiums[1].teams.push({followers: 150, mascot: 'aquaman'});
        Stadiums[1].teams.push({followers: 350, mascot: 'batman'});
        Stadiums[1].teams.push({followers: 180, mascot: 'catwoman'});
        Stadiums[1].teams.push({followers: 180, mascot: 'daredevil'});

        Associations.Stadium.createEach(Stadiums, function(err) {
          assert.ifError(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return the correct average', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {average: ['followers'] })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 1);
          assert.strictEqual(Stadiums[0].teams[0].followers, 215);
          done();
        });
      });

      it('should return the correct min', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {min: ['followers'] })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 1);
          assert.strictEqual(Stadiums[0].teams[0].followers, 150);
          done();
        });
      });

      it('should return the correct max', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {max: ['followers'] })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 1);
          assert.strictEqual(Stadiums[0].teams[0].followers, 350);
          done();
        });
      });

      it('should return the correct sum', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {sum: ['followers'] })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 1);
          assert.strictEqual(Stadiums[0].teams[0].followers, 860);
          done();
        });
      });

      it('should return records with contains modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {mascot: {contains: 'at'}, sort: 'mascot asc' })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 2);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'batman');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'catwoman');
          done();
        });
      });

      it('should return records with endsWith modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {mascot: {endsWith: 'man'}, sort: 'mascot asc' })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 3);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'aquaman');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'batman');
          assert.strictEqual(Stadiums[0].teams[2].mascot, 'catwoman');
          done();
        });
      });

      it('should return records with greaterThan modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {followers: {greaterThan: 160}, sort: 'followers asc' })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 3);
          assert.strictEqual(Stadiums[0].teams[0].followers, 180);
          assert.strictEqual(Stadiums[0].teams[1].followers, 180);
          assert.strictEqual(Stadiums[0].teams[2].followers, 350);
          done();
        });
      });

      it('should return records with multiple sort array notation', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {sort: ['followers asc', 'mascot desc'] })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 4);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'aquaman');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'daredevil');
          assert.strictEqual(Stadiums[0].teams[2].mascot, 'catwoman');
          assert.strictEqual(Stadiums[0].teams[3].mascot, 'batman');
          done();
        });
      });

      it('should return records with in modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {mascot: ['aquaman', 'daredevil'], sort: 'mascot desc'})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 2);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'daredevil');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'aquaman');
          done();
        });
      });

      it('should return records with lessThan modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {followers: {lessThan: 300}, sort: 'mascot desc' })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 3);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'daredevil');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'catwoman');
          assert.strictEqual(Stadiums[0].teams[2].mascot, 'aquaman');
          done();
        });
      });

      it('should return records with like modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {mascot: {like: '%at%man'}, sort: 'mascot desc' })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 2);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'catwoman');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'batman');
          done();
        });
      });

      it('should return records with limit modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {followers: 180, limit: 1, sort: 'mascot desc'})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 1);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'daredevil');
          done();
        });
      });

      it('should return records with not modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {followers: {'!': 180}, sort: 'mascot desc'})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 2);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'batman');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'aquaman');
          done();
        });
      });

      it('should return records with notIn modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {mascot: { '!': ['aquaman', 'daredevil']}, sort: 'mascot desc'})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 2);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'catwoman');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'batman');
          done();
        });
      });

      it('should return records with or modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {where: { or: [{mascot:'batman'}, {followers: 150}]}, sort: 'mascot desc'})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 2);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'batman');
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'aquaman');
          done();
        });
      });

      it('should return records with select modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {followers: 180, select: ['mascot'], sort: 'id desc'})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 2);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'daredevil');
          assert.strictEqual(Stadiums[0].teams[0].followers, undefined);
          assert.strictEqual(Stadiums[0].teams[1].mascot, 'catwoman');
          assert.strictEqual(Stadiums[0].teams[1].followers, undefined);

          done();
        });
      });

      it('should return records with skip modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {followers: 180, skip: 1, sort: 'mascot desc'})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 1);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'catwoman');
          done();
        });
      });

      it('should return records with startsWith modifier', function(done) {
        Associations.Stadium.find({ where: { name: 'modifier2' }})
          .populate('teams', {mascot: {startsWith: 'bat'}})
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 1);
          assert.strictEqual(Stadiums[0].name, 'modifier2');
          assert(Array.isArray(Stadiums[0].teams));
          assert.strictEqual(Stadiums[0].teams.length, 1);
          assert.strictEqual(Stadiums[0].teams[0].mascot, 'batman');
          done();
        });
      });

      it('should return the correct records with skip, limit and sort', function(done) {
        Associations.Stadium.find({ where: { name: {startsWith: 'modifier'}}, limit: 2, skip: 1, sort: {budget: 1, name: 0} })
          .populate('teams', { limit: 2, skip: 1, sort: {followers: 1, mascot: 0} })
          .exec(function(err, Stadiums) {
          assert.ifError(err);
          assert(Array.isArray(Stadiums));
          assert.strictEqual(Stadiums.length, 2);
          assert.strictEqual(Stadiums[0].name, 'modifier4');
          assert.strictEqual(Stadiums[1].name, 'modifier2');
          assert(Array.isArray(Stadiums[1].teams));
          assert.strictEqual(Stadiums[1].teams.length, 2);
          assert.strictEqual(Stadiums[1].teams[0].mascot, 'daredevil');
          assert.strictEqual(Stadiums[1].teams[1].mascot, 'catwoman');
          done();
        });
      });


    });
  });
});
