var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Text Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var textId;
      var description = 'a';
      for(var i = 0; i < 10000; ++i) {
        description += 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
      }
      description += 'c';
      it('should store proper text value', function(done) {
        Semantic.User.create({ description: description }, function(err, createdRecord) {
          assert.ifError(err);
          assert.equal(createdRecord.description, description);
          textId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            assert(record.description === description, 'text should match');
            done();
          });
        });
      });

      it('should find record by text criteria', function(done) {
        Semantic.User.find({description: description}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');
          assert.strictEqual(record[0].id, textId, 'id should correspond');
          assert(record[0].description === description, 'text should match');
          done();
        });
      });

    });
  });
});
