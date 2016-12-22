var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Belongs To Associations', function() {
    describe('create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var customerId;

      before(function(done) {
        // Check payment belongsTo Customer
        assert.strictEqual(Associations.Payment.attributes.a_customer.model, 'customer');
        assert.strictEqual(Associations.Customer.attributes.payments.collection, 'payment');

        Associations.Customer.create({ name: 'belongsTo add' }).exec(function(err, cust) {
          assert.ifError(err);
          customerId = cust.id;
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a foreign key value when passed an association key', function(done) {
        Associations.Payment.create({ amount: 1, a_customer: customerId }).exec(function(err, payment) {
          assert.ifError(err);
          assert.equal(payment.a_customer.toString(), customerId.toString());
          done();
        });
      });
    });

  });
});
