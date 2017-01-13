var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Boolean Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var trueId;
      var falseId;

      it('should store proper boolean true value', function(done) {
        Semantic.User.create({ status: true }, function (err, createdRecord) {
          assert.ifError(err);
          assert.strictEqual(createdRecord.status, true);
          trueId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            assert.strictEqual(record.status, true, 'boolean should be true');
            done();
          });
        });
      });

      it('should store proper boolean false value', function(done) {
        Semantic.User.create({ status: false }, function (err, createdRecord) {
          assert.ifError(err);
          assert.strictEqual(createdRecord.status, false);
          falseId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            assert.strictEqual(record.status, false, 'boolean should be false');
            done();
          });
        });
      });

      it('should find boolean true value', function(done) {
        Semantic.User.find({id: [trueId, falseId], status: true}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');
          assert.strictEqual(record[0].status, true, 'boolean should be true');
          assert.strictEqual(record[0].id, trueId, 'id should correspond');
          done();
        });
      });

      it('should find boolean false value', function(done) {
        Semantic.User.find({id: [trueId, falseId], status: false}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');
          assert.strictEqual(record[0].status, false, 'boolean should be false');
          assert.strictEqual(record[0].id, falseId, 'id should correspond');
          done();
        });
      });

      it('should not found false value on true status', function(done) {
        Semantic.User.find({id: trueId, status: false}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 0, 'should have 0 result');
          done();
        });
      });

      it('should not found true value on false status', function(done) {
        Semantic.User.find({id: falseId, status: true}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 0, 'should have 0 result');
          done();
        });
      });

    });
  });
});
