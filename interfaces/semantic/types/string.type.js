var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('String Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var stringId;

      it('should store proper string value', function(done) {
        Semantic.User.create({ first_name: 'Foo' }, function(err, createdRecord) {
          assert.ifError(err);
          assert.equal(createdRecord.first_name, 'Foo');
          stringId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            assert.equal(record.first_name, 'Foo');
            done();
          });
        });
      });

      it('should find record by string criteria', function(done) {
        Semantic.User.find({first_name: 'Foo'}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');
          assert.strictEqual(record[0].id, stringId, 'id should correspond');
          assert.strictEqual(record[0].first_name, 'Foo', 'first_name should correspond');
          done();
        });
      });

    });
  });
});
