var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {
    describe('association .remove()', function() {

      describe('with an id', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var stadiumRecord, teamRecord;

        // Create a Customer and a payment
        before(function(done) {
          // Check Stadium hasManytoMany Team through Venue
          assert.strictEqual(Associations.Stadium.attributes.teams.collection, 'team');
          assert.strictEqual(Associations.Team.attributes.stadiums.collection, 'stadium');
          assert.strictEqual(Associations.Venue.attributes.stadium.model, 'stadium');
          assert.strictEqual(Associations.Venue.attributes.team.model, 'team');

          Associations.Stadium.create({ name: 'hasManyThrough remove' }, function(err, stadium) {
            assert.ifError(err);

            stadiumRecord = stadium;

            Associations.Team.create({ name: 'team remove 1', stadiums: stadium.id }, function(err, team) {
              assert.ifError(err);

              teamRecord = team;

              done();
            });
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should remove the stadiums foreign key from the team', function(done) {
          stadiumRecord.teams.remove(teamRecord.id);
          stadiumRecord.save(function(err) {
            assert.ifError(err);

            // Look up the customer again to be sure the payment was added
            Associations.Stadium.findOne(stadiumRecord.id)
            .populate('teams')
            .exec(function(err, data) {
              assert.ifError(err);

              assert.strictEqual(data.teams.length, 0);
              done();
            });
          });
        });
      });

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        // var stadiumRecord;
        //
        // before(function(done) {
        //   Associations.Stadium.create({ name: 'hasMany add' }, function(err, model) {
        //     assert.ifError(err);
        //     customerRecord = model;
        //     done();
        //   });
        // });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should error when an object is passed in', function(done) {
          stadiumRecord.teams.remove({ name: 'team remove 1' });
          stadiumRecord.save(function(err) {
            assert(err);
            assert(err.failedTransactions)
            assert(Array.isArray(err.failedTransactions));
            assert.strictEqual(err.failedTransactions.length, 1);
            assert.equal(err.failedTransactions[0].type, 'remove');

            done();
          });
        });
      });

    });
  });
});
