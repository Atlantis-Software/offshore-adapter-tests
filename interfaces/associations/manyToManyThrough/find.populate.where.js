var assert = require('assert');
var _ = require('lodash');
var util = require('util');





describe('Association Interface', function() {

  describe('Many to Many Through Association', function() {

    var Stadium;

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {
      // Check Stadium hasManytoMany Team through Venue
      assert.strictEqual(Associations.Stadium.attributes.teams.collection, 'team');
      assert.strictEqual(Associations.Team.attributes.stadiums.collection, 'stadium');
      assert.strictEqual(Associations.Venue.attributes.stadium.model, 'stadium');
      assert.strictEqual(Associations.Venue.attributes.team.model, 'team');

      Associations.Stadium.createEach([
        { name: 'hasMany find where 1' },
        { name: 'hasMany find where 2' }
      ],
      function(err, stadiums) {
        assert.ifError(err);

        Associations.Stadium.find({ name: {startsWith: 'hasMany find where'}})
        .sort('name asc')
        .exec(function(err, stadiums) {
          assert.ifError(err);

          assert(Array.isArray(stadiums));
          assert.strictEqual(stadiums.length, 2);

          Stadium = stadiums[0];
          var teams = [];

          for(var i=0; i<8; i++) {
            if(i < 4) {
              if (i < 2) {
                teams.push({ name: 'teamWhere'+i, mascot: 'Platypus',  stadiums: stadiums[0].id });
              } else {
                teams.push({ name: 'teamWhere'+i, mascot: 'Bison',  stadiums: stadiums[0].id });
              }
            } else {
              teams.push({ name: 'teamWhere'+i, mascot: 'Tapir', stadiums: stadiums[1].id });
            }
          }

          Associations.Team.createEach(teams, function(err, teams) {
            assert.ifError(err);
            done();
          });
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return only payments less than or equal to 2', function(done) {
        Associations.Stadium.find({ name: {startsWith: 'hasMany find where'}, sort: 'name asc'})
        .populate('teams', { mascot:'Platypus' , limit: 2, sort: { name: 1 }})
        .sort('name asc')
        .exec(function(err, stadiums) {
          assert.ifError(err);

          assert(Array.isArray(stadiums));
          assert.strictEqual(stadiums.length, 2);

          assert(Array.isArray(stadiums[0].teams));
          assert(Array.isArray(stadiums[1].teams));

          assert(stadiums[0].teams.length === 2,
          'expecting stadiums[0] to have 2 teams, but actually it looks like: \n'+util.inspect(stadiums[0],false, null));

          assert.strictEqual(stadiums[0].teams[0].name, 'teamWhere0');
          assert.strictEqual(stadiums[0].teams[1].name, 'teamWhere1');

          assert.strictEqual(stadiums[1].teams.length, 0);

          done();
        });
      });

      it('should return payments using skip and limit', function(done) {
        Associations.Stadium.find({ name: {startsWith: 'hasMany find where'}})
        .populate('teams', { skip: 1, limit: 2, sort: { name: 1 } })
        .sort('name asc')
        .exec(function(err, stadiums) {
          assert.ifError(err);

          assert(Array.isArray(stadiums));
          assert.strictEqual(stadiums.length, 2);

          assert(Array.isArray(stadiums[0].teams));
          assert(Array.isArray(stadiums[1].teams));

          assert.strictEqual(stadiums[0].teams.length, 2);
          assert.strictEqual(stadiums[0].teams[0].name, 'teamWhere1');
          assert.strictEqual(stadiums[0].teams[1].name, 'teamWhere2');

          assert(
            stadiums[1].teams.length === 2,
            'expected stadiums[1] to have 2 payments but instead it looks like:\n'+
            util.inspect(stadiums[1].teams, false, null)
          );
          assert(
            stadiums[1].teams[0].name === 'teamWhere5',
            'expected stadiums[1].teams[0].name === 5, but stadiums[1] ==>\n'+
            util.inspect(stadiums[1], false, null)
          );
          assert.strictEqual(stadiums[1].teams[1].name, 'teamWhere6');

          done();
        });
      });

      it('should allow filtering by primary key', function(done) {

        // Find the teams
        Associations.Team.findOne({ name: 'teamWhere1'}).exec(function(err, teams) {
          assert.ifError(err);

          Associations.Stadium.find({ name: {startsWith: 'hasMany find where'}})
          .populate('teams', {where : { id: teams.id }, sort : {name : 1}})
          .sort('name asc')
          .exec(function(err, stadiums) {
            assert.ifError(err);

            assert(Array.isArray(stadiums));
            assert.strictEqual(stadiums.length, 2);

            assert(Array.isArray(stadiums[0].teams));
            assert(Array.isArray(stadiums[1].teams));

            assert.strictEqual(stadiums[0].teams.length, 1);
            assert.strictEqual(stadiums[0].teams[0].name, 'teamWhere1');
            assert.strictEqual(stadiums[1].teams.length, 0);
            done();
          });
        });

      });

    });
  });
});
