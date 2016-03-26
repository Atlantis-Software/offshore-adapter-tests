var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Through Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var stadiumRecord, stadiumRecord2, teamRecord, teamRecord2;

    before(function(done) {
      Associations.Stadium.create({ name: 'hasManyThrough stadium'}, function(err, stadium) {
        if(err) return done(err);
        stadiumRecord = stadium;
      Associations.Stadium.create({ name: 'hasManyThrough stadium2'}, function(err, stadium2) {
        if(err) return done(err);
        stadiumRecord2 = stadium2;
          Associations.Team.create({ name: 'hasManyThrough team1', mascot: 'elephant' }, function(err, team) {
            if(err) return done(err);
            teamRecord = team;

            Associations.Team.create({ name: 'hasManyThrough team1', mascot: 'fox' }, function(err, team2) {
              if(err) return done(err);
              teamRecord2 = team2;

              Associations.Venue.create({ seats: 200, stadium: stadium.id, team: team.id }, function(err, venue) {
                if(err) return done(err);

                Associations.Venue.create({ seats: 200, stadium: stadium2.id, team: team2.id }, function(err, venue) {
                  if(err) return done(err);
                    done();
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
        Associations.Stadium.find([1,2])
        .populate('teams')
        .exec(function(err, stadiums) {
          assert(!err, err);
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
        Associations.Stadium.find({ name: 'hasManyThrough stadium' })
        .populate('teams')
        .exec(function(err, stadiums) {
          assert(!err, err);

          var obj = stadiums[0].toJSON();

          assert(Array.isArray(obj.teams));
          assert.strictEqual(obj.teams.length, 1);
          assert(!obj.teams[0].mascot);

          done();
        });
      });

    });
  });
});
