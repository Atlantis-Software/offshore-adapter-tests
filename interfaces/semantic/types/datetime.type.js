var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Datetime Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var dateId;
      var date = new Date(2010, 10, 05, 10, 03, 40);
      var origDate = date.getTime();

      it('should store proper datetime value', function(done) {
        Semantic.User.create({ dob: date }, function(err, createdRecord) {
          assert.ifError(err);
          createdDate = createdRecord.dob.getTime();
          assert.strictEqual(origDate, createdDate);
          dateId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            // Convert both dates to unix timestamps
            var resultDate = record.dob.getTime();
            assert.strictEqual(origDate, resultDate, 'datetime should correspond');
            done();
          });
        });
      });

      it('should find record by datetime criteria', function(done) {
        Semantic.User.find({dob: date}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');

          // Convert both dates to unix timestamps
          var resultDate = record[0].dob.getTime();
          assert.strictEqual(dateId, record[0].id, 'id should correspond');
          assert.strictEqual(origDate, resultDate, 'datetime should correspond');
          done();
        });
      });

    });
  });
});
