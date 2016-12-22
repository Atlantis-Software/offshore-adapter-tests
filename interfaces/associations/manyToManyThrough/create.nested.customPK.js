var assert = require('assert');
var _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Through Association', function() {
    describe('create nested through associations when a custom primary key is used()', function() {
      describe('with single level depth', function() {

        describe('and objects', function() {

          before(function(done) {
            // Check Stadium hasManytoMany Team through Venue
            assert.strictEqual(Associations.Stadiumcustom.attributes.teams.collection, 'teamcustom');
            assert.strictEqual(Associations.Teamcustom.attributes.stadiums.collection, 'stadiumcustom');
            assert.strictEqual(Associations.Venuecustom.attributes.stadium.model, 'stadiumcustom');
            assert.strictEqual(Associations.Venuecustom.attributes.team.model, 'teamcustom');
            done();
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new stadium and team through association', function(done) {

            var data = {
              address: 'address 1',
              name: 'has many through nested',
              teams: [
                { location: 'Stark tower', name: 'Avengers', mascot: 'Hulk' },
                { location: 'Space station', name: 'Justice League', mascot: 'Batman' }
              ]
            };
            Associations.Stadiumcustom.create(data)
            .exec(function(err, values) {
              assert.ifError(err);
              // Look up the stadium again to be sure the teams were added
              Associations.Stadiumcustom.findOne({address: values.address})
              .populate('teams', { sort: 'name ASC' })
              .exec(function(err, model) {
                assert.ifError(err);

                assert(model, 'should find the parent');
                assert.equal(model.teams.length, 2);

                assert.equal(model.teams[0].location, 'Stark tower');
                assert.equal(model.teams[0].name, 'Avengers');
                assert.equal(model.teams[0].mascot, 'Hulk');

                assert.equal(model.teams[1].location, 'Space station');
                assert.equal(model.teams[1].name, 'Justice League');
                assert.equal(model.teams[1].mascot, 'Batman');

                done();
              });

            });
          });
        });

        describe('and objects mixed with ids', function() {
          var idTeam;
          before(function(done) {
            Associations.Teamcustom.create({ location: 'Xavier institute', name: 'X-Men', mascot: 'Wolverine' })
            .exec(function(err, team) {
              assert.ifError(err);
              idTeam = team.location;
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new stadium and team through association', function(done) {

            var data = {
              address: 'address 2',
              name: 'mixed custom through create',
              teams: [
                idTeam,
                { location: 'Copyright hell', name : 'Fantastic Four', mascot: 'Dr Doom' }
              ]
            };

            Associations.Stadiumcustom.create(data)
            .exec(function(err, values) {
              assert.ifError(err);

              // Look up the stadium again to be sure the teams were added
              Associations.Stadiumcustom.findOne({address: values.address})
              .populate('teams', { sort: 'name ASC' })
              .exec(function(err, model) {
                assert.ifError(err);
                assert(model, 'should find the parent');
                assert.equal(model.teams.length, 2);

                assert.equal(model.teams[0].location, 'Copyright hell');
                assert.equal(model.teams[0].name, 'Fantastic Four');
                assert.equal(model.teams[0].mascot, 'Dr Doom');

                assert.equal(model.teams[1].location, 'Xavier institute');
                assert.equal(model.teams[1].name, 'X-Men');
                assert.equal(model.teams[1].mascot, 'Wolverine');

                done();
              });

            });
          });
        });

      });
    });
  });
});
