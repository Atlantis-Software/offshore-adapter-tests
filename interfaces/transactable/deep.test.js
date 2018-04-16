var Offshore = require(process.env.offshorePath || 'offshore');
var assert = require('assert');
var _ = require('lodash');

describe('Transaction cross adapter', function() {

  it('should deep populate', function(done) {
    var customerName = 'Parent customer deep';
    var paymentName = 'Child payment deep';
    var receiptName = 'Grandchild label deep';

    Transactable.Customer.create({name: customerName}, function(err, customer) {
      if (err) {
        done(err);
      }
      assert.equal(customer.name, customerName);
      Transactable.Payment.createEach([{type: paymentName, a_customer: customer.id},
        {type: paymentName, a_customer: customer.id}], function(err, payments) {
        if (err) {
          done(err);
        }
        assert.equal(payments.length, 2);
        Transactable.Receipt.createEach([{label: receiptName, a_payment: payments[0].id},
          {label: receiptName, a_payment: payments[0].id}, {label: receiptName, a_payment: payments[1].id},
          {label: receiptName, a_payment: payments[1].id}], function(err, receipts) {
          if (err) {
            done(err);
          }
          assert.equal(receipts.length, 4);

          Offshore.Transaction([Transactable.Customer, Transactable.Payment, Transactable.Receipt], function(trx, cb) {
            trx.customer.findOne({name: customerName}).populate('payments.receipts').exec(function(err, populatedCustomer) {
              if (err) {
                return done(err);
              }
              assert.equal(populatedCustomer.name, customerName);
              assert.equal(populatedCustomer.payments.length, 2, 'Should populate 2 payments');
              assert.equal(populatedCustomer.payments[0].receipts.length, 2, 'Should populate 2 receipts for each payment');
              assert.equal(populatedCustomer.payments[1].receipts.length, 2, 'Should populate 2 receipts for each payment');
              return cb(null, populatedCustomer);
            });
          }).exec(function(err, result) {
            if (err) {
              done(err);
            }
            done();
          });
        });
      });
    });
  });
  
  it('find deep criteria', function(done) {
    var customerName1 = 'Parent customer find deep';
    var paymentName = 'Child payment find deep';
    var receiptName1 = 'Grandchild label find deep';
    var customerName2 = 'Parent customer find deep 2';
    var receiptName2 = 'Grandchild label find deep 2';

    Transactable.Customer.createEach([{name: customerName1}, {name: customerName2}], function(err, customers) {
      if (err) {
        done(err);
      }
      assert.equal(customers.length, 2);
      Transactable.Payment.createEach([{type: paymentName, a_customer: customers[0].id},
        {type: paymentName, a_customer: customers[1].id}], function(err, payments) {
        if (err) {
          done(err);
        }
        assert.equal(payments.length, 2);
        Transactable.Receipt.createEach([{label: receiptName1, a_payment: payments[0].id},
          {label: receiptName1, a_payment: payments[0].id}, {label: receiptName2, a_payment: payments[1].id},
          {label: receiptName2, a_payment: payments[1].id}], function(err, receipts) {
          if (err) {
            done(err);
          }
          assert.equal(receipts.length, 4);

          Offshore.Transaction([Transactable.Customer, Transactable.Payment, Transactable.Receipt], function(trx, cb) {
            trx.customer.find({payments: {receipts: {label: receiptName1}}}).exec(function(err, populatedCustomers) {
              if (err) {
                return done(err);
              }
              assert.equal(populatedCustomers.length, 1);
              assert.equal(populatedCustomers[0].id, customers[0].id);
              assert.equal(populatedCustomers[0].name, customerName1);
              return cb(null, populatedCustomers);
            });
          }).exec(function(err, result) {
            if (err) {
              done(err);
            }
            done();
          });
        });
      });
    });
  });

});