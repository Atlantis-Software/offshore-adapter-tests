var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:m through association :: .update()', function() {
    describe('update nested through associations()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

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

            var data = {
              name: 'has many nested update'
            };

            Associations.Stadium.create(data).exec(function(err, values) {
              assert.ifError(err);
              stadiumRecord = values;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create new teams', function(done) {

            var data = {
              name: '1:m update nested - updated',
              teams: [
                { name: 'nested team' }
              ]
            };

            Associations.Stadium.update({ id: stadiumRecord.id }, data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Stadium.findOne(values[0].id)
              .populate('teams')
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested - updated');
                assert.strictEqual(model.teams.length, 1);
                assert.strictEqual(model.teams[0].name, 'nested team');
                done();
              });
            });
          });
        });


        describe('when associations already exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var stadiumRecord;

          before(function(done) {

            var data = {
              name: '1:m update nested 1',
              payments: [
                { name: 'nested team 1' },
                { name: 'nested team 2' }
              ]
            };

            Associations.Stadium.create(data).exec(function(err, stadium) {
              assert.ifError(err);
              stadiumRecord = stadium;
              done();
            });
          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var data = {
              name: '1:m update nested 1 - updated',
              teams: [
                { name: 'nested team 3' },
                { name: 'nested team 4' },
                { name: 'nested team 5' }
              ]
            };

            Associations.Stadium.update({ id: stadiumRecord.id }, data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the stadium again to be sure the teams were added
              Associations.Stadium.findOne(values[0].id)
              .populate('teams', { sort: 'name ASC' })
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested 1 - updated');
                assert.strictEqual(model.teams.length, 3);
                assert.strictEqual(model.teams[0].name, 'nested team 3');
                assert.strictEqual(model.teams[1].name, 'nested team 4');
                assert.strictEqual(model.teams[2].name, 'nested team 5');
                done();
              });

            });
          });
        });

        describe('when associations have primary keys', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var stadiumRecord, teamsRecord;

          before(function(done) {

            var teamData = [
              { name: 'nested team 1' },
              { name: 'nested team 2' }
            ];

            var data = {
              name: '1:m update nested 2',
              payments: [
                { name: 'nested team 3' },
                { name: 'nested team 4' }
              ]
            };

            Associations.Team.create(teamData).exec(function(err, teams) {
              assert.ifError(err);
              teamsRecord = teams;

              Associations.Stadium.create(data).exec(function(err, stadium) {
                assert.ifError(err);
                stadiumRecord = stadium;
                done();
              });
            });
          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should update association values', function(done) {

            var data = {
              name: '1:m update nested 2 - updated',
              teams: teamsRecord.map(function(team) { return team.toObject(); })
            };

            Associations.Stadium.update({ id: stadiumRecord.id }, data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the stadium again to be sure the teams were added
              Associations.Stadium.findOne(values[0].id)
              .populate('teams',{sort:{name : 1}})
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested 2 - updated');
                assert.strictEqual(model.teams.length, 2);

                // Ensure association values were updated
                assert.strictEqual(model.teams[0].name, 'nested team 1');
                assert.strictEqual(model.teams[1].name, 'nested team 2');

                done();
              });

            });
          });
        });

      });
    });
  });
});
