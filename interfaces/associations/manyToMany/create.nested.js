var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .add()', function() {
    describe('create nested associations()', function() {

      describe('with single level depth', function() {

        describe('and objects', function() {

          before(function(done) {
            // Check Driver hasManytoMany Taxis
            assert.strictEqual(Associations.Driver.attributes.taxis.collection, 'taxi');
            assert.strictEqual(Associations.Taxi.attributes.drivers.collection, 'driver');
            done();
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new driver and taxis and associate them', function(done) {

            var data = {
              name: 'many to many nested',
              taxis: [
                { medallion: 1 },
                { medallion: 2 }
              ]
            };

            Associations.Driver.create(data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Driver.findOne(values.id)
              .populate('taxis',{sort : {medallion : 1}})
              .exec(function(err, model) {
                assert.ifError(err);
                assert.strictEqual(model.taxis.length, 2);
                assert.strictEqual(model.taxis[1].medallion, 2);
                done();
              });

            });
          });
        });

        describe('and objects mixed with ids', function() {
          var taxiId;

          before(function(done) {
            Associations.Taxi.create({ medallion: 1337 }).exec(function(err, taxi) {
              assert.ifError(err);
              taxiId = taxi.id;
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new driver and taxi associations', function(done) {
            var data = {
              name: 'many to many nested',
              taxis: [
                taxiId,
                { medallion: 2 }
              ]
            };

            Associations.Driver.create(data).exec(function(err, values) {
              assert.ifError(err);
              assert(values.taxis.length);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values.id)
              .populate('taxis', {sort: 'id ASC'})
              .exec(function(err, model) {
                assert.ifError(err);
                assert.strictEqual(model.taxis.length, 2);
                assert.strictEqual(model.taxis[1].medallion, 2);
                done();
              });

            });
          });
        });

      });
    });
  });
});
