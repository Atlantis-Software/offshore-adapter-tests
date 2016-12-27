var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecord, paymentRecord, customerCustomRecord, paymentCustomRecord;

    before(function(done) {
      // Check Payment belongsTo Customer
      assert.strictEqual(Associations.Payment.attributes.a_customer.model, 'customer');
      assert.strictEqual(Associations.Customer.attributes.payments.collection, 'payment');
      assert.strictEqual(Associations.Paymentbelongscustom.attributes.customer.model, 'customerbelongscustom');
      assert.strictEqual(Associations.Customerbelongscustom.attributes.payments.collection, 'paymentbelongscustom');

      var customers = [{ name: 'foo' }, { name: 'bar' }, { name: 'foobar' }];
      Associations.Customer.create(customers, function(err, customers) {
        assert.ifError(err);

        var payments = [
          { type: 'dynamic finders belongs bar', amount: 200, a_customer: customers[0].id},
          { type: 'dynamic finders belongs foobar', amount: 200, a_customer: customers[1].id },
          { type: 'dynamic finders belongs foo', amount: 250, a_customer: customers[2].id }
        ];

        Associations.Payment.createEach(payments, function(err, payments) {
          assert.ifError(err);

          var customerCustoms = [{ username: 'dynamic finder belongs foo' }, { username: 'dynamic finder belongs bar' }, { username: 'dynamic finder belongs foobar' }];
          Associations.Customerbelongscustom.create(customerCustoms, function(err, customerCustoms) {
            assert.ifError(err);

            var paymentCustoms = [
              { invoice: 700, type: 'dynamic finders belongs custom foo', amount: 400, customer: customerCustoms[0].username },
              { invoice: 701, type: 'dynamic finders belongs custom bar', amount: 400, customer: customerCustoms[1].username },
              { invoice: 702, type: 'dynamic finders belongs custom foobar', amount: 450, customer: customerCustoms[2].username }
            ];

            Associations.Paymentbelongscustom.createEach(paymentCustoms, function(err, paymentCustoms) {
              assert.ifError(err);

              // Cache customer and payment
              customerRecords = customers;
              paymentRecords = payments;
              customerCustomRecords = customerCustoms;
              paymentCustomRecords = paymentCustoms;

              done();
            });
          });
        });
      });
    });

    describe('dynamic finders', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the dynamic finder method is used for findOne', function(done) {
        Associations.Payment.findOneByA_customer(customerRecords[0].id)
        .exec(function(err, payment) {
          assert.ifError(err);

          assert(payment.a_customer);
          assert.equal(payment.a_customer, customerRecords[0].id);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for findOneIn', function(done) {
        Associations.Payment.findOneByA_customerIn([customerRecords[0].id])
        .exec(function(err, payment) {
          assert.ifError(err);

          assert(payment.a_customer);
          assert.equal(payment.a_customer, customerRecords[0].id);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for findOneLike', function(done) {
        Associations.Paymentbelongscustom.findOneByCustomerLike('%bar').sort('invoice asc')
        .exec(function(err, payment) {
          assert.ifError(err);

          assert(payment);
          assert.equal(payment.customer, customerCustomRecords[1].username);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for find', function(done) {
        Associations.Payment.findByA_customer(customerRecords[0].id)
        .exec(function(err, payments) {
          assert.ifError(err);

          assert.equal(payments.length, 1);
          assert(payments[0].a_customer);
          assert.equal(payments[0].a_customer, customerRecords[0].id);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for findIn', function(done) {
        Associations.Payment.findByA_customerIn([customerRecords[0].id, customerRecords[1].id]).sort('invoice asc')
        .exec(function(err, payments) {
          assert.ifError(err);

          assert.strictEqual(payments.length, 2);
          assert.equal(payments[0].a_customer, customerRecords[0].id);
          assert.equal(payments[1].a_customer, customerRecords[1].id);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for findLike', function(done) {
        Associations.Paymentbelongscustom.findByCustomerLike('%bar').sort('invoice asc')
        .exec(function(err, payments) {
          assert.ifError(err);

          assert.strictEqual(payments.length, 2);
          assert.equal(payments[0].customer, customerCustomRecords[1].username);
          assert.equal(payments[1].customer, customerCustomRecords[2].username);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for count', function(done) {
        Associations.Payment.countByA_customer(customerRecords[0].id)
        .exec(function(err, paymentsCount) {
          assert.ifError(err);

          assert.strictEqual(paymentsCount, 1);
          done();
        });
      });

      it('should return customer when the dynamic finder method is used for countIn', function(done) {
        Associations.Payment.countByA_customerIn([customerRecords[0].id, customerRecords[1].id, 5000])
        .exec(function(err, paymentsCount) {
          assert.ifError(err);

          assert.strictEqual(paymentsCount, 2);
          done();
        });
      });

      it('should return customer when the dynamic finder method is used for countLike', function(done) {
        Associations.Paymentbelongscustom.countByCustomerLike('%bar')
        .exec(function(err, paymentsCount) {
          assert.ifError(err);

          assert.strictEqual(paymentsCount, 2);
          done();
        });
      });

      it('should return customer when the dynamic finder method is used for startsWith', function(done) {
        Associations.Paymentbelongscustom.customerStartsWith('dynamic').sort('invoice asc')
        .exec(function(err, payments) {
          assert.ifError(err);

          assert.strictEqual(payments.length, 3);
          assert.equal(payments[0].customer, customerCustomRecords[0].username);
          assert.equal(payments[1].customer, customerCustomRecords[1].username);
          assert.equal(payments[2].customer, customerCustomRecords[2].username);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for contains', function(done) {
        Associations.Paymentbelongscustom.customerContains('foo').sort('invoice asc')
        .exec(function(err, payments) {
          assert.ifError(err);

          assert.strictEqual(payments.length, 2);
          assert.equal(payments[0].customer, customerCustomRecords[0].username);
          assert.equal(payments[1].customer, customerCustomRecords[2].username);

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for endsWith', function(done) {
        Associations.Paymentbelongscustom.customerEndsWith('bar').sort('invoice asc')
        .exec(function(err, payments) {
          assert.ifError(err);

          assert.strictEqual(payments.length, 2);
          assert.equal(payments[0].customer, customerCustomRecords[1].username);
          assert.equal(payments[1].customer, customerCustomRecords[2].username);

          done();
        });
      });

    });
  });
});
