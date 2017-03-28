var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('BelongsTo Association', function() {
    describe('Modifiers', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {
        // Check Payment belongsTo Customer
        assert.strictEqual(Associations.Payment.attributes.a_customer.model, 'customer');
        assert.strictEqual(Associations.Customer.attributes.payments.collection, 'payment');

        var Payments = [];

        Payments.push({type: 'modifier1', amount: 10000});
        Payments.push({type: 'modifier2', amount: 25000, a_customer: {capital: 150, name: 'batman'}});
        Payments.push({type: 'modifier3', amount: 32000});
        Payments.push({type: 'modifier4', amount: 25000});

        Associations.Payment.createEach(Payments, function(err) {
          assert.ifError(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return the correct average', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {average: ['capital'] })
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.capital, 150);
          done();
        });
      });

      it('should return the correct min', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {min: ['capital'] })
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.capital, 150);
          done();
        });
      });

      it('should return the correct max', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {max: ['capital'] })
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.capital, 150);
          done();
        });
      });

      it('should return the correct sum', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {sum: ['capital'] })
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.capital, 150);
          done();
        });
      });

      it('should return records with contains modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {name: {contains: 'at'}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with endsWith modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {name: {endsWith: 'man'}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with greaterThan modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {capital: {greaterThan: 120}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.capital, 150);
          done();
        });
      });

      it('should return records with in modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {name: ['batman', 'daredevil']})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with lessThan modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {capital: {lessThan: 300}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with like modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {name: {like: '%at%man'}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with limit modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {capital: 150, limit: 1})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with not modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {capital: {'!': 180}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with notIn modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {name: { '!': ['aquaman', 'daredevil']}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with or modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {where: { or: [{name:'batman'}, {capital: 230}]}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

      it('should return records with select modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {capital: 150, select: ['name']})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          assert.strictEqual(payments[0].a_customer.capital, undefined);
          done();
        });
      });

      it('should return records with skip modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {capital: 150, skip: 1})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert.strictEqual(payments[0].a_customer, null, 'customer should be null');
          done();
        });
      });

      it('should return records with startsWith modifier', function(done) {
        Associations.Payment.find({ where: { type: 'modifier2' }})
          .populate('a_customer', {name: {startsWith: 'bat'}})
          .exec(function(err, payments) {
          assert.ifError(err);
          assert(Array.isArray(payments));
          assert.strictEqual(payments.length, 1);
          assert.strictEqual(payments[0].type, 'modifier2');
          assert(_.isObject(payments[0].a_customer));
          assert.strictEqual(payments[0].a_customer.name, 'batman');
          done();
        });
      });

    });
  });
});
