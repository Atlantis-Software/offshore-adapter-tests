var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Float Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var floatId;

      it('should store proper float value', function(done) {
        Semantic.User.create({ percent: 0.001 }, function(err, createdRecord) {
          assert.ifError(err);
          assert.strictEqual(createdRecord.percent, 0.001);
          floatId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function(err, record) {
            assert.ifError(err);
            assert.strictEqual(record.percent, 0.001, 'percent should correspond');
            done();
          });
        });
      });

      it('should find record by float criteria', function(done) {
        Semantic.User.find({percent: 0.001}, function(err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');
          assert.strictEqual(record[0].id, floatId, 'id should correspond');
          assert.strictEqual(record[0].percent, 0.001, 'percent should correspond');
          done();
        });
      });

    });
  });
});
