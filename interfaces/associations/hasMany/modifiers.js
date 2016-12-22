var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {
    describe('Modifiers', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {

        // Check Customer hasMany Payments
        assert.strictEqual(Associations.Customer.attributes.payments.collection, 'payment');
        assert.strictEqual(Associations.Payment.attributes.a_customer.model, 'customer');

        var Customers = [];

        Customers.push({name: 'modifier1', capital: 10000, payments: []});
        Customers.push({name: 'modifier2', capital: 25000, payments: []});
        Customers.push({name: 'modifier3', capital: 32000, payments: []});
        Customers.push({name: 'modifier4', capital: 25000, payments: []});

        Customers[1].payments.push({amount: 150, type: 'aquaman'});
        Customers[1].payments.push({amount: 350, type: 'batman'});
        Customers[1].payments.push({amount: 180, type: 'catwoman'});
        Customers[1].payments.push({amount: 180, type: 'daredevil'});

        Associations.Customer.createEach(Customers, function(err) {
          assert.ifError(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return the correct average', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {average: ['amount'] })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 1);
          assert.strictEqual(customers[0].payments[0].amount, 215);
          done();
        });
      });

      it('should return the correct min', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {min: ['amount'] })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 1);
          assert.strictEqual(customers[0].payments[0].amount, 150);
          done();
        });
      });

      it('should return the correct max', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {max: ['amount'] })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 1);
          assert.strictEqual(customers[0].payments[0].amount, 350);
          done();
        });
      });

      it('should return the correct sum', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {sum: ['amount'] })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 1);
          assert.strictEqual(customers[0].payments[0].amount, 860);
          done();
        });
      });

      it('should return records with contains modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {type: {contains: 'at'}, sort: 'type asc' })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 2);
          assert.strictEqual(customers[0].payments[0].type, 'batman');
          assert.strictEqual(customers[0].payments[1].type, 'catwoman');
          done();
        });
      });

      it('should return records with endsWith modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {type: {endsWith: 'man'}, sort: 'type asc' })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 3);
          assert.strictEqual(customers[0].payments[0].type, 'aquaman');
          assert.strictEqual(customers[0].payments[1].type, 'batman');
          assert.strictEqual(customers[0].payments[2].type, 'catwoman');
          done();
        });
      });

      it('should return records with greaterThan modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {amount: {greaterThan: 160}, sort: 'amount asc' })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 3);
          assert.strictEqual(customers[0].payments[0].amount, 180);
          assert.strictEqual(customers[0].payments[1].amount, 180);
          assert.strictEqual(customers[0].payments[2].amount, 350);
          done();
        });
      });

      it('should return records with multiple sort array notation', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {sort: ['amount asc', 'type desc'] })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 4);
          assert.strictEqual(customers[0].payments[0].type, 'aquaman');
          assert.strictEqual(customers[0].payments[1].type, 'daredevil');
          assert.strictEqual(customers[0].payments[2].type, 'catwoman');
          assert.strictEqual(customers[0].payments[3].type, 'batman');
          done();
        });
      });

      it('should return records with in modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {type: ['aquaman', 'daredevil'], sort: 'type desc'})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 2);
          assert.strictEqual(customers[0].payments[0].type, 'daredevil');
          assert.strictEqual(customers[0].payments[1].type, 'aquaman');
          done();
        });
      });

      it('should return records with lessThan modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {amount: {lessThan: 300}, sort: 'type desc' })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 3);
          assert.strictEqual(customers[0].payments[0].type, 'daredevil');
          assert.strictEqual(customers[0].payments[1].type, 'catwoman');
          assert.strictEqual(customers[0].payments[2].type, 'aquaman');
          done();
        });
      });

      it('should return records with like modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {type: {like: '%at%man'}, sort: 'type desc' })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 2);
          assert.strictEqual(customers[0].payments[0].type, 'catwoman');
          assert.strictEqual(customers[0].payments[1].type, 'batman');
          done();
        });
      });

      it('should return records with limit modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {amount: 180, limit: 1, sort: 'type desc'})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 1);
          assert.strictEqual(customers[0].payments[0].type, 'daredevil');
          done();
        });
      });

      it('should return records with not modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {amount: {'!': 180}, sort: 'type desc'})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 2);
          assert.strictEqual(customers[0].payments[0].type, 'batman');
          assert.strictEqual(customers[0].payments[1].type, 'aquaman');
          done();
        });
      });

      it('should return records with notIn modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {type: { '!': ['aquaman', 'daredevil']}, sort: 'type desc'})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 2);
          assert.strictEqual(customers[0].payments[0].type, 'catwoman');
          assert.strictEqual(customers[0].payments[1].type, 'batman');
          done();
        });
      });

      it('should return records with or modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {where: { or: [{type:'batman'}, {amount: 150}]}, sort: 'type desc'})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 2);
          assert.strictEqual(customers[0].payments[0].type, 'batman');
          assert.strictEqual(customers[0].payments[1].type, 'aquaman');
          done();
        });
      });

      it('should return records with select modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {amount: 180, select: ['type'], sort: 'id desc'})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 2);
          assert.strictEqual(customers[0].payments[0].type, 'daredevil');
          assert.strictEqual(customers[0].payments[0].amount, undefined);
          assert.strictEqual(customers[0].payments[1].type, 'catwoman');
          assert.strictEqual(customers[0].payments[1].amount, undefined);

          done();
        });
      });

      it('should return records with skip modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {amount: 180, skip: 1, sort: 'type desc'})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 1);
          assert.strictEqual(customers[0].payments[0].type, 'catwoman');
          done();
        });
      });

      it('should return records with startsWith modifier', function(done) {
        Associations.Customer.find({ where: { name: 'modifier2' }})
          .populate('payments', {type: {startsWith: 'bat'}})
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 1);
          assert.strictEqual(customers[0].name, 'modifier2');
          assert(Array.isArray(customers[0].payments));
          assert.strictEqual(customers[0].payments.length, 1);
          assert.strictEqual(customers[0].payments[0].type, 'batman');
          done();
        });
      });

      it('should return the correct records with skip, limit and sort', function(done) {
        Associations.Customer.find({ where: { name: {startsWith: 'modifier'}}, limit: 2, skip: 1, sort: {capital: 1, name: 0} })
          .populate('payments', { limit: 2, skip: 1, sort: {amount: 1, type: 0} })
          .exec(function(err, customers) {
          assert.ifError(err);
          assert(Array.isArray(customers));
          assert.strictEqual(customers.length, 2);
          assert.strictEqual(customers[0].name, 'modifier4');
          assert.strictEqual(customers[1].name, 'modifier2');
          assert(Array.isArray(customers[1].payments));
          assert.strictEqual(customers[1].payments.length, 2);
          assert.strictEqual(customers[1].payments[0].type, 'daredevil');
          assert.strictEqual(customers[1].payments[1].type, 'catwoman');
          done();
        });
      });


    });
  });
});
