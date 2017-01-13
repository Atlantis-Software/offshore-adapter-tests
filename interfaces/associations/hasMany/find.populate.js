var util = require('util');
var assert = require('assert');
var _ = require('lodash');




describe('Association Interface', function() {

  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecords, paymentRecords

    before(function(done) {

      // Check Customer hasMany Payments
      assert.strictEqual(Associations.Customer.attributes.payments.collection, 'payment');
      assert.strictEqual(Associations.Payment.attributes.a_customer.model, 'customer');

      var customers = [
        { name: 'hasMany find pop' },
        { name: 'hasMany find pop' }
      ];

      Associations.Customer.createEach(customers, function(err, customers) {
        assert.ifError(err);

        customerRecords = customers;

        Associations.Customer.find({ name: 'hasMany find pop'})
        .sort('id asc')
        .exec(function(err, customers) {
          assert.ifError(err);


          // Create 8 payments, 4 from one customer, 4 from another
          var payments = [];
          for(var i=0; i<8; i++) {
            if(i < 4) payments.push({ amount: i, a_customer: customers[0].id });
            if(i >= 4) payments.push({ amount: i, a_customer: customers[1].id });
          }

          Associations.Payment.createEach(payments, function(err, payments) {
            assert.ifError(err);

            paymentRecords = payments;
            done();
          });
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return payments when the populate criteria is added', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments')
        .exec(function(err, customers) {
          assert(!err, err);

          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 2, 'expected 2 customers, got these customers:'+require('util').inspect(customers, false, null));

          assert(Array.isArray(customers[0].payments));
          assert(Array.isArray(customers[1].payments));

          assert.strictEqual(customers[0].payments.length, 4);
          assert.strictEqual(customers[1].payments.length, 4);

          done();
        });
      });

      it('should return all the populated records when a limit clause is used', function(done) {

        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments', {sort: 'amount asc'})
        .limit(1)
        .sort('id asc')
        .exec(function(err, customers) {
          assert(!err, err);

          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);

          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 4, 'Expected customers[0] to have 4 payments, but got '+customers[0].payments.length+'.  Customers: '+require('util').inspect(customers, false, null));
          assert.strictEqual(customers[0].payments[0].amount, 0);

          done();
        });
      });

      // TODO: pull this stuff into a separate test:
      ////////////////////////////////////////////////////////////////////////////////////

      // e.g.
      // Associations.Customer.find({ name: 'hasMany find' })
      //   .populate('payments', {
      //     limit: 2,
      //     sort: {amount: -1}
      //   })
      //   .limit(2)
      //   .sort('id DESC')

      // it('should return expected child records for ALL parent records when populate..limit is used');
      // it('should return expected child records for ALL parent records when populate..skip is used');
      // it('should return expected child records for ALL parent records when populate..limit..skip is used');

      // it('should return expected child records for ALL parent records when populate..sort is used');
      // it('should return expected child records for ALL parent records when populate..sort..limit is used');
      // it('should return expected child records for ALL parent records when populate..sort..skip is used');
      // it('should return expected child records for ALL parent records when populate..sort..limit..skip is used');

      // it('should return expected child records for ALL parent records when populate..where is used');
      // it('should return expected child records for ALL parent records when populate..where..limit is used');
      // it('should return expected child records for ALL parent records when populate..where..skip is used');
      // it('should return expected child records for ALL parent records when populate..where..limit..skip is used');

      // it('should return expected child records for ALL parent records when populate..where..limit..sort is used');
      // it('should return expected child records for ALL parent records when populate..where..skip..sort is used');
      // it('should return expected child records for ALL parent records when populate..where..limit..skip..sort is used');
      ////////////////////////////////////////////////////////////////////////////////////

      it('should return all the populated records when a skip clause is used', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments', { sort: { amount: 1 } })
        .skip(1)
        .sort('id asc')
        .exec(function(err, customers) {
          assert(!err, err);

          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);

          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 4);
          assert(customers[0].payments[0].amount === 4,
            'Expected customers[0].payments[0].amount === 4, but customers[0] ==>\n'+
            util.inspect(customers[0]));

          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .exec(function(err, customers) {
          assert.ifError(err);

          var obj = customers[0].toJSON();
          assert(!obj.payments);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments')
        .exec(function(err, customers) {
          assert.ifError(err);

          var obj = customers[0].toJSON();

          assert(Array.isArray(obj.payments));
          assert.strictEqual(obj.payments.length, 4);

          assert(!obj.payments[0].hasOwnProperty('type'));
          assert(!obj.payments[1].hasOwnProperty('type'));
          assert(!obj.payments[2].hasOwnProperty('type'));
          assert(!obj.payments[3].hasOwnProperty('type'));

          done();
        });
      });

      it('should find association key in parent model', function(done) {
        Associations.Payment.find({a_customer: customerRecords[0].id})
        .populate('a_customer')
        .exec(function(err, payments) {
          assert.ifError(err);
          assert.strictEqual(payments.length, 4);
          assert.strictEqual(payments[0].a_customer.id, customerRecords[0].id);
          assert.strictEqual(payments[1].a_customer.id, customerRecords[0].id);
          assert.strictEqual(payments[2].a_customer.id, customerRecords[0].id);
          assert.strictEqual(payments[3].a_customer.id, customerRecords[0].id);

          done();
        });
      });

    });
  });
});
