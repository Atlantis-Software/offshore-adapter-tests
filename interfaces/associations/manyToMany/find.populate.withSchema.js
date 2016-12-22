var assert = require('assert');
var _ = require('lodash');

if (adapterFeatures.indexOf('schemas') > -1) {
  describe('Association Interface (with schemas)', function() {

    describe('n:m association :: .find().populate()', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var driverRecord;

      before(function(done) {
        // Check Driver hasManytoMany Taxis
        assert.strictEqual(Associations.Driverwithschema.attributes.taxis.collection, 'taxiwithschema');
        assert.strictEqual(Associations.TaxiwithSchema.attributes.drivers.collection, 'driverwithschema');

        Associations.Driverwithschema.create({ name: 'manymany find'}, function(err, driver) {
          assert.ifError(err);

          driverRecord = driver;

          var taxis = [];
          for(var i=0; i<2; i++) {
            driverRecord.taxis.add({ medallion: i });
          }

          driverRecord.save(function(err) {
            assert.ifError(err);
            done();
          });
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return taxis when the populate criteria is added', function(done) {
        Associations.Driverwithschema.find({ name: 'manymany find' })
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
        Associations.Driverwithschema.find()
        .exec(function(err, drivers) {
          assert.ifError(err);

          var obj = drivers[0].toJSON();
          assert(!obj.taxis);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Associations.Driverwithschema.find({ name: 'manymany find' })
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

    });
  });
}
