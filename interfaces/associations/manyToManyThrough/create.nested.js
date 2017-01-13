var assert = require('assert');
var _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Through Association', function() {
    describe('create nested through associations when a custom primary key is used()', function() {
      describe('with single level depth', function() {

        describe('and objects', function() {

          before(function(done) {
            // Check Stadium hasManytoMany Team through Venue
            assert.strictEqual(Associations.Stadium.attributes.teams.collection, 'team');
            assert.strictEqual(Associations.Team.attributes.stadiums.collection, 'stadium');
            assert.strictEqual(Associations.Venue.attributes.stadium.model, 'stadium');
            assert.strictEqual(Associations.Venue.attributes.team.model, 'team');
            done();
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new stadium and team through association', function(done) {

            var data = {
              name: 'has many through nested',
              teams: [
                { name: 'Avengers', mascot: 'Hulk' },
                { name: 'Justice League', mascot: 'Batman' }
              ]
            };

            Associations.Stadium.create(data)
            .exec(function(err, values) {
              assert.ifError(err);
              // Look up the stadium again to be sure the teams were added
              Associations.Stadium.findOne({name: values.name})
              .populate('teams', { sort: 'name ASC' })
              .exec(function(err, model) {
                assert.ifError(err);

                assert(model, 'should find the parent');
                assert.equal(model.teams.length, 2);

                assert.equal(model.teams[0].name, 'Avengers');
                assert.equal(model.teams[0].mascot, 'Hulk');

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
            Associations.Team.create({ name: 'X-Men', mascot: 'Wolverine' })
            .exec(function(err, team) {
              assert.ifError(err);
              idTeam = team.id;
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new stadium and payment association', function(done) {

            var data = {
              name: 'mixed custom through create',
              teams: [
                idTeam,
                { name : 'Fantastic Four', mascot: 'Dr Doom' }
              ]
            };

            Associations.Stadium.create(data)
            .exec(function(err, values) {
              assert.ifError(err);

              // Look up the stadium again to be sure the teams were added
              Associations.Stadium.findOne({name: values.name})
              .populate('teams', { sort: 'name ASC' })
              .exec(function(err, model) {
                assert.ifError(err);

                assert(model, 'should find the parent');
                assert.equal(model.teams.length, 2);

                assert.equal(model.teams[0].name, 'Fantastic Four');
                assert.equal(model.teams[0].mascot, 'Dr Doom');

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
