var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .find().populate()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driverRecord;

    before(function(done) {
      // Check Driver hasManytoMany Taxis
      assert.strictEqual(Associations.Driver.attributes.taxis.collection, 'taxi');
      assert.strictEqual(Associations.Taxi.attributes.drivers.collection, 'driver');

      Associations.Driver.create({ name: 'manymany find'}, function(err, driver) {
        assert.ifError(err);

        driverRecord = driver;

        var taxis = [];
        for(var i=0; i<2; i++) {
          driverRecord.taxis.add({ medallion: i });
        }

        driverRecord.save(function(err) {
          assert.ifError(err);

          Associations.Driver.create({ name: 'manymany find no child'}, function(err, driver) {
            assert.ifError(err);
            done();
          });
        });
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return taxis when the populate criteria is added', function(done) {
      Associations.Driver.find({ name: 'manymany find' })
      .populate('taxis')
      .exec(function(err, drivers) {
        assert.ifError(err);

        assert(Array.isArray(drivers));
        assert.strictEqual(drivers.length, 1);
        assert(Array.isArray(drivers[0].taxis));
        assert.strictEqual(drivers[0].taxis.length, 2);

        done();
      });
    });

    it('should not return a taxis object when the populate is not added', function(done) {
      Associations.Driver.find()
      .exec(function(err, drivers) {
        assert.ifError(err);

        var obj = drivers[0].toJSON();
        assert(!obj.taxis);

        done();
      });
    });

    it('should call toJSON on all associated records if available', function(done) {
      Associations.Driver.find({ name: 'manymany find' })
      .populate('taxis')
      .exec(function(err, drivers) {
        assert.ifError(err);

        var obj = drivers[0].toJSON();
        assert(!obj.name);

        assert(Array.isArray(obj.taxis));
        assert.strictEqual(obj.taxis.length, 2);

        assert(obj.taxis[0].hasOwnProperty('createdAt'));
        assert(!obj.taxis[0].hasOwnProperty('medallion'));
        assert(obj.taxis[1].hasOwnProperty('createdAt'));
        assert(!obj.taxis[1].hasOwnProperty('medallion'));

        done();
      });
    });

    it('populate should be an empty array if id refer to an undefined child', function(done) {
      Associations.Driver.find({ name: 'manymany find no child' })
      .populate('taxis')
      .exec(function(err, drivers) {
        assert.ifError(err);

        assert.strictEqual(drivers.length, 1);

        assert(!_.isUndefined(drivers[0].taxis), 'Child should not be undefined');
        assert(_.isArray(drivers[0].taxis), 'Child should be an array');
        assert.strictEqual(drivers[0].taxis.length, 0);

        done();
      });
    });

  });
});
