var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Integer Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var integerId;

      it('should store proper integer', function(done) {
        Semantic.User.create({ age: 27 }, function (err, createdRecord) {
          assert.ifError(err);
          assert.strictEqual(createdRecord.age, 27);
          integerId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            assert.strictEqual(record.age, 27, 'age should correspond');
            done();
          });
        });
      });

      it('should find record by integer criteria', function(done) {
        Semantic.User.find({age: 27}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');
          assert.strictEqual(record[0].id, integerId, 'id should correspond');
          assert.strictEqual(record[0].age, 27, 'age should correspond');
          done();
        });
      });

    });
  });
});
