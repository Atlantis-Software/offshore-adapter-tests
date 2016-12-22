var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:m through association :: .update()', function() {
    describe('update nested through associations with custom primary keys()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var stadiumRecord;

          before(function(done) {
            // Check Stadium hasManytoMany Team through Venue
            assert.strictEqual(Associations.Stadiumcustom.attributes.teams.collection, 'teamcustom');
            assert.strictEqual(Associations.Teamcustom.attributes.stadiums.collection, 'stadiumcustom');
            assert.strictEqual(Associations.Venuecustom.attributes.stadium.model, 'stadiumcustom');
            assert.strictEqual(Associations.Venuecustom.attributes.team.model, 'teamcustom');
            
            var data = {
              address: 'address has many nested custom 1',
              name: 'has many nested custom update 1'
            };

            Associations.Stadiumcustom.create(data)
            .exec(function(err, values) {
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
              name: '1:m update nested custom 1 - updated',
              teams: [
                { location: 'location has many nested custom 1', name: 'nested team 1' }
              ]
            };

            Associations.Stadiumcustom.update({ address: stadiumRecord.address })
            .set(data)
            .exec(function(err, values) {
              assert.ifError(err);

              // Look up the stadium again to be sure the teams were added
              Associations.Stadiumcustom.findOne(values[0].address)
              .populate('teams')
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested custom 1 - updated');
                assert.equal(model.teams.length, 1);
                assert.equal(model.teams[0].location, 'location has many nested custom 1');
                assert.equal(model.teams[0].name, 'nested team 1');
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
              address: 'address has many nested custom 2',
              name: 'has many nested custom update 2',
              teams: [
                { location: 'location has many nested custom 2', name: 'nested team 2' },
                { location: 'location has many nested custom 3', name: 'nested team 3' }
              ]
            };

            Associations.Stadiumcustom.create(data)
            .exec(function(err, stadium) {
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
              name: '1:m update nested custom 2 - updated',
              teams: [
                { location: 'location has many nested custom 4', name: 'nested team 4' },
                { location: 'location has many nested custom 5', name: 'nested team 5' },
                { location: 'location has many nested custom 6', name: 'nested team 6' }
              ]
            };

            Associations.Stadiumcustom.update({ address: stadiumRecord.address })
            .set(data)
            .exec(function(err, values) {
              assert.ifError(err);

              // Look up the stadium again to be sure the teams were added
              Associations.Stadiumcustom.findOne(values[0].address)
              .populate('teams', { sort: 'name ASC' })
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested custom 2 - updated');
                assert.equal(model.teams.length, 3);

                assert.equal(model.teams[0].location, 'location has many nested custom 4');
                assert.equal(model.teams[0].name, 'nested team 4');

                assert.equal(model.teams[1].location, 'location has many nested custom 5');
                assert.equal(model.teams[1].name, 'nested team 5');

                assert.equal(model.teams[2].location, 'location has many nested custom 6');
                assert.equal(model.teams[2].name, 'nested team 6');
                done();
              });

            });
          });
        });

      });
    });
  });
});
