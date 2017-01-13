var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Multiple Many to Many Through Associations', function() {
    describe('association .add()', function() {

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var stadiumRecord;

        before(function(done) {
          // Check Stadium hasManytoMany Team through Venue
          assert.strictEqual(Associations.Stadiummany.attributes.teams.collection, 'teammany');
          assert.strictEqual(Associations.Teammany.attributes.stadiums.collection, 'stadiummany');
          assert.strictEqual(Associations.Venuemany.attributes.stadium.model, 'stadiummany');
          assert.strictEqual(Associations.Venuemany.attributes.team.model, 'teammany');

          assert.strictEqual(Associations.Stadiummany.attributes.nativeTeams.collection, 'teammany');
          assert.strictEqual(Associations.Teammany.attributes.nativeStadiums.collection, 'stadiummany');
          assert.strictEqual(Associations.Venuemany.attributes.nativeStadium.model, 'stadiummany');
          assert.strictEqual(Associations.Venuemany.attributes.nativeTeam.model, 'teammany');

          Associations.Stadiummany.create({ name: 'manyAssociations through uno hasMany add' }, function(err, model) {
            assert.ifError(err);

            stadiumRecord = model;
            Associations.Teammany.create({ name: 'team many 1', stadiums: model.id }, done);
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should create a new team and nativeTeam through association', function(done) {
          stadiumRecord.teams.add({ name: 'team many 2' });
          stadiumRecord.nativeTeams.add({ name: 'nativeTeam many 1' });
          stadiumRecord.save(function(err) {
            assert.ifError(err);

            // Look up the stadium again to be sure the team was added
            Associations.Stadiummany.findOne(stadiumRecord.id)
            .populate('teams', {sort: 'id asc'})
            .populate('nativeTeams', {sort: 'id asc'})
            .exec(function(err, stadium) {
              assert.ifError(err);
              assert.strictEqual(stadium.teams.length, 2);
              assert.strictEqual(stadium.teams[0].name, 'team many 1');
              assert.strictEqual(stadium.teams[1].name, 'team many 2');

              assert.strictEqual(stadium.nativeTeams.length, 1, 'Expected stadium to have 1 nativeTeam, but actually it has '+stadium.nativeTeams.length+', see?  \n'+require('util').inspect(stadium,false,null));
              assert.strictEqual(stadium.nativeTeams[0].name, 'nativeTeam many 1');
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
            { name: 'manyAssociations through hasMany 1' },
            { name: 'manyAssociations through hasMany 2' }
          ];

          Associations.Stadiummany.createEach(records, function(err, models) {
            assert.ifError(err);

            stadiumRecord = models[0];
            Associations.Teammany.create({ name: 'team many 3', stadiums: models[1].id }, function(err, teamModel) {
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
            Associations.Stadiummany.findOne(stadiumRecord.id)
            .populate('teams')
            .exec(function(err, data) {
              assert.ifError(err);

              assert.strictEqual(data.teams.length, 1);
              assert.strictEqual(data.teams[0].name, 'team many 3');
              done();
            });
          });
        });
      });

    });
  });
});
