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
      for(var i = 0; i < 1000; ++i) {
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

    });
  });
});
