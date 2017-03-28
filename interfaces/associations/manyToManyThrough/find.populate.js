var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Through Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var stadiumRecord, stadiumRecord2, teamRecord, teamRecord2;

    before(function(done) {
      // Check Stadium hasManytoMany Team through Venue
      assert.strictEqual(Associations.Stadium.attributes.teams.collection, 'team');
      assert.strictEqual(Associations.Team.attributes.stadiums.collection, 'stadium');
      assert.strictEqual(Associations.Venue.attributes.stadium.model, 'stadium');
      assert.strictEqual(Associations.Venue.attributes.team.model, 'team');

      Associations.Stadium.create({ name: 'hasManyThrough find stadium'}, function(err, stadium) {
        assert.ifError(err);
        stadiumRecord = stadium;
        Associations.Stadium.create({ name: 'hasManyThrough find stadium2'}, function(err, stadium2) {
          assert.ifError(err);
          stadiumRecord2 = stadium2;
          Associations.Stadium.create({ name: 'find stadium hasManyThrough no child'}, function(err, stadium3) {
            assert.ifError(err);

            Associations.Team.create({ name: 'hasManyThrough team1', mascot: 'elephant' }, function(err, team) {
              assert.ifError(err);
              teamRecord = team;

              Associations.Team.create({ name: 'hasManyThrough team1', mascot: 'fox' }, function(err, team2) {
                assert.ifError(err);
                teamRecord2 = team2;

                Associations.Venue.create({ seats: 200, stadium: stadium.id, team: team.id }, function(err, venue) {
                  assert.ifError(err);

                  Associations.Venue.create({ seats: 200, stadium: stadium2.id, team: team2.id }, function(err, venue) {
                    assert.ifError(err);
                      done();
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return teams when the populate criteria is added', function(done) {
        Associations.Stadium.find({name: {startsWith: 'hasManyThrough find stadium'}})
        .populate('teams')
        .exec(function(err, stadiums) {
          assert.ifError(err);
          assert(Array.isArray(stadiums));
          assert.strictEqual(stadiums.length, 2);
          assert(Array.isArray(stadiums[0].teams));
          assert.strictEqual(stadiums[0].teams.length, 1);
          assert(Array.isArray(stadiums[1].teams));
          assert.strictEqual(stadiums[1].teams.length, 1);
          done();
        });
      });

      it('should not return a teams object when the populate is not added', function(done) {
        Associations.Stadium.find()
        .exec(function(err, stadiums) {
          assert.ifError(err);

          var obj = stadiums[0].toJSON();
          assert(!obj.teams);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Associations.Stadium.find({ name: 'hasManyThrough find stadium' })
        .populate('teams')
        .exec(function(err, stadiums) {
          assert.ifError(err);

          assert(Array.isArray(stadiums));
          assert.strictEqual(stadiums.length, 1);
          var obj = stadiums[0].toJSON();

          assert(Array.isArray(obj.teams));
          assert.strictEqual(obj.teams.length, 1);
          assert(!obj.teams[0].mascot);

          done();
        });
      });

      it('populate should be an empty array if id refer to an undefined child', function(done) {
        Associations.Stadium.find({name: 'find stadium hasManyThrough no child'})
        .populate('teams')
        .exec(function(err, stadiums) {
          assert.ifError(err);

          assert.strictEqual(stadiums.length, 1);
          assert(!_.isUndefined(stadiums[0].teams), 'Child should not be undefined');
          assert(_.isArray(stadiums[0].teams), 'Child should be an array');
          assert.strictEqual(stadiums[0].teams.length, 0);
          done();
        });
      });

    });
  });
});
