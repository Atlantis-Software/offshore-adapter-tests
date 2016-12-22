var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Date Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var dateId;
      var date = new Date(0);

      it('should store proper date value', function(done) {
        Semantic.User.create({ birthday: date }, function(err, createdRecord) {
          assert.ifError(err);
          createdDate = Date.parse(new Date(createdRecord.birthday));
          assert.strictEqual(0, createdDate);
          dateId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            // Convert both dates to unix timestamps
            var resultDate = Date.parse(new Date(record.birthday));
            assert.strictEqual(0, resultDate, 'date should correspond');
            done();
          });
        });
      });

      it('should find record by date criteria', function(done) {
        var findDate = new Date(3600*1000*5.5);

        Semantic.User.find({ birthday: findDate }, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');

          // Convert both dates to unix timestamps
          var resultDate = Date.parse(new Date(record[0].birthday));
          assert.strictEqual(dateId, record[0].id, 'id should correspond');
          assert.strictEqual(0, resultDate, 'date should correspond');
          done();
        });
      });

    });
  });
});
