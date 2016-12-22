var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Time Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      var timeId;
      var deliveryTime = new Date();
      var time = deliveryTime.getHours() + ':' + deliveryTime.getMinutes() + ':' + deliveryTime.getSeconds();

      it('should store proper time value', function(done) {
        Semantic.User.create({ dailyDelivery: deliveryTime }, function(err, createdRecord) {
          assert.ifError(err);
          createdTime = createdRecord.dailyDelivery.getHours() + ':' + createdRecord.dailyDelivery.getMinutes() + ':' + createdRecord.dailyDelivery.getSeconds();
          assert.strictEqual(time, createdTime);
          timeId = createdRecord.id;
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            var resultTime = record.dailyDelivery.getHours() + ':' + record.dailyDelivery.getMinutes() + ':' + record.dailyDelivery.getSeconds();
            assert.strictEqual(time, resultTime, 'time should correspond');
            done();
          });
        });
      });

      it('should find record by time criteria', function(done) {
        var findTime = _.clone(deliveryTime);
        findTime.setFullYear(2000);
        Semantic.User.find({dailyDelivery: findTime}, function (err, record) {
          assert.ifError(err);
          assert.strictEqual(record.length, 1, 'should have 1 result');
          var resultTime = record[0].dailyDelivery.getHours() + ':' + record[0].dailyDelivery.getMinutes() + ':' + record[0].dailyDelivery.getSeconds();
          assert.strictEqual(timeId, record[0].id, 'id should correspond');
          assert.strictEqual(time, resultTime, 'time should correspond');

          done();
        });
      });

    });
  });
});
