var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Through Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecord;

    before(function(done) {
      // Check Stadium hasManytoMany Team through Venue
      assert.strictEqual(Associations.Stadium.attributes.teams.collection, 'team');
      assert.strictEqual(Associations.Team.attributes.stadiums.collection, 'stadium');
      assert.strictEqual(Associations.Venue.attributes.stadium.model, 'stadium');
      assert.strictEqual(Associations.Venue.attributes.team.model, 'team');

      Associations.Stadium.create({ name: 'hasMany findOne' }, function(err, stadium) {
        assert.ifError(err);

        stadiumRecord = stadium;

        var teams = [];

        for(var i=0; i<4; i++) {
          teams.push({ name: 'teamFindOne'+i, stadiums: stadium.id });
        }

        Associations.Team.createEach(teams, function(err) {
          assert.ifError(err);
          done();
        });
      });
    });

    describe('.findOne', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return teams when the populate criteria is added', function(done) {
       Associations.Stadium.findOne({ id: stadiumRecord.id })
        .populate('teams')
        .exec(function(err, stadium) {
          assert.ifError(err);

          assert.strictEqual(stadium.id, stadiumRecord.id);
          assert(Array.isArray(stadium.teams));
          assert.strictEqual(stadium.teams.length, 4);
          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Associations.Stadium.findOne({ id: stadiumRecord.id })
        .exec(function(err, stadium) {
          assert.ifError(err);

          assert.strictEqual(stadium.id, stadiumRecord.id);
          var obj = stadium.toJSON();
          assert(!obj.teams);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Associations.Stadium.findOne({ id: stadiumRecord.id })
        .populate('teams')
        .exec(function(err, stadium) {
          assert.ifError(err);

          var obj = stadium.toJSON();

          assert.strictEqual(stadium.id, stadiumRecord.id);
          assert(Array.isArray(obj.teams));
          assert.strictEqual(obj.teams.length, 4);
          assert(!obj.teams[0].hasOwnProperty('type'));
          assert(!obj.teams[1].hasOwnProperty('type'));
          assert(!obj.teams[2].hasOwnProperty('type'));
          assert(!obj.teams[3].hasOwnProperty('type'));

          done();
        });
      });

    });
  });
});
