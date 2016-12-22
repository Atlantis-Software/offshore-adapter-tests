var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Multiple Belongs To Association', function() {
    describe('create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var customer_1_id, customer_2_id;

      before(function(done) {
        // Check Payment belongsTo Customer
        assert.strictEqual(Associations.Payment_many.attributes.customer.model, 'customer_many');
        assert.strictEqual(Associations.Payment_many.attributes.patron.model, 'customer_many');
        assert.strictEqual(Associations.Customer_many.attributes.payments.collection, 'payment_many');
        assert.strictEqual(Associations.Customer_many.attributes.transactions.collection, 'payment_many');

        Associations.Customer_many.create({ name: 'manyAssociations uno add' }).exec(function(err, cust) {
          assert.ifError(err);
          customer_1_id = cust.id;

          Associations.Customer_many.create({ name: 'manyAssociations dos add' }).exec(function(err, cust) {
            assert.ifError(err);
            customer_2_id = cust.id;
            done();
          });
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create multiple foreign key values when passed association keys', function(done) {
        Associations.Payment_many.create({ amount: 1, customer: customer_1_id, patron: customer_2_id }).exec(function(err, payment) {
          assert.ifError(err);
          assert.equal(payment.customer.toString(), customer_1_id.toString());
          assert.equal(payment.patron.toString(), customer_2_id.toString());
          done();
        });
      });

      it('should populate values only for specified keys', function(done) {

        Associations.Payment_many.create({ amount: 10, customer: customer_1_id, patron: customer_2_id }).exec(function(err) {
          assert.ifError(err);

          Associations.Payment_many.findOne({ amount: 10 })
          .populate('patron')
          .exec(function(err, payment) {
            assert.ifError(err);

            var obj = payment.toJSON();

            assert(obj.patron);
            assert.equal(obj.patron.id.toString(), customer_2_id.toString());
            assert.equal(obj.customer.toString(), customer_1_id.toString());

            done();
          });
        });
      });
    });
  });

});
