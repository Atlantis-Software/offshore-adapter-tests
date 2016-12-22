var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Through Association', function() {
    describe('association .add()', function() {

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var stadiumRecord;

        before(function(done) {
          // Check Stadium hasManytoMany Team through Venue
          assert.strictEqual(Associations.Stadium.attributes.teams.collection, 'team');
          assert.strictEqual(Associations.Team.attributes.stadiums.collection, 'stadium');
          assert.strictEqual(Associations.Venue.attributes.stadium.model, 'stadium');
          assert.strictEqual(Associations.Venue.attributes.team.model, 'team');

          Associations.Stadium.create({ name: 'hasMany through add stadium 1' }, function(err, model) {
            assert.ifError(err);

            stadiumRecord = model;
            Associations.Team.create({ name: 'hasMany through add team 1', stadiums: stadiumRecord.id }, done);
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should create a new team association', function(done) {
          stadiumRecord.teams.add({ name: 'hasMany through add team 2' });
          stadiumRecord.save(function(err) {
            assert.ifError(err);

            // Look up the stadium again to be sure the team was added
            Associations.Stadium.findOne(stadiumRecord.id)
            .populate('teams', {sort: 'id asc'})
            .exec(function(err, model) {
              assert.ifError(err);

              assert.strictEqual(model.teams.length, 2);
              assert.strictEqual(model.teams[0].name, 'hasMany through add team 1');
              assert.strictEqual(model.teams[1].name, 'hasMany through add team 2');
              done();
            });
          });
        });
      });

      describe('with an id', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var stadiumRecord, teamRecord;

        before(function(done) {

          var records = [
            { name: 'hasMany through add stadium 2' },
            { name: 'hasMany through add stadium 3' }
          ];

          Associations.Stadium.createEach(records, function(err, models) {
            assert.ifError(err);

            stadiumRecord = models[0];
            Associations.Team.create({ name: 'hasMany through add team 3', stadiums: models[1].id }, function(err, teamModel) {
              assert.ifError(err);

              teamRecord = teamModel;
              done();
            });
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should link the team to another association', function(done) {
          stadiumRecord.teams.add(teamRecord.id);
          stadiumRecord.save(function(err) {
            assert.ifError(err);

            // Look up the stadium again to be sure the team was added
            Associations.Stadium.findOne(stadiumRecord.id)
            .populate('teams')
            .exec(function(err, data) {
              assert.ifError(err);

              assert.strictEqual(data.teams.length, 1);
              assert.strictEqual(data.teams[0].name, 'hasMany through add team 3');
              done();
            });
          });
        });
      });

    });
  });
});
