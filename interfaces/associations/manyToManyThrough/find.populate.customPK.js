var util = require('util');
var assert = require('assert');
var _ = require('lodash');


describe('Association Interface', function() {

  describe('Has Many Through Association with Custom Primary Keys', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {
      // Check Stadium hasManytoMany Team through Venue
      assert.strictEqual(Associations.Stadiumcustom.attributes.teams.collection, 'teamcustom');
      assert.strictEqual(Associations.Teamcustom.attributes.stadiums.collection, 'stadiumcustom');
      assert.strictEqual(Associations.Venuecustom.attributes.stadium.model, 'stadiumcustom');
      assert.strictEqual(Associations.Venuecustom.attributes.team.model, 'teamcustom');

      var stadiumRecords = [
        { address: 'a00-A', name: 'hasManyThrough find customPK' },
        { address: 'b00-B', name: 'hasManyThrough find customPK' }
      ];

      Associations.Stadiumcustom.createEach(stadiumRecords, function(err, stadiums) {
        assert.ifError(err);

        Associations.Stadiumcustom.find({ name: 'hasManyThrough find customPK' })
        .sort('address asc')
        .exec(function(err, stadiums) {
          assert.ifError(err);

          // Create 8 teams, 4 for one stadium, 4 for the other
          var teams = [];
          for(var i=0; i<8; i++) {
            if(i < 4) teams.push({ location: 'team'+i, stadiums: stadiums[0].address });
            if(i >= 4) teams.push({ location: 'team'+i, stadiums: stadiums[1].address });
          }

          Associations.Teamcustom.createEach(teams, function(err, teams) {
            assert.ifError(err);
            done();
          });
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return teams when the populate criteria is added', function(done) {
        Associations.Stadiumcustom.find({ name: 'hasManyThrough find customPK' })
        .populate('teams')
        .exec(function(err, stadiums) {
          assert.ifError(err);

          assert(Array.isArray(stadiums));
          assert.strictEqual(stadiums.length, 2, 'expected 2 stadiums, got these stadiums:'+require('util').inspect(stadiums, false, null));

          assert(Array.isArray(stadiums[0].teams));
          assert(Array.isArray(stadiums[1].teams));

          assert.strictEqual(stadiums[0].teams.length, 4);
          assert.strictEqual(stadiums[1].teams.length, 4);

          done();
        });
      });

    });
  });
});
