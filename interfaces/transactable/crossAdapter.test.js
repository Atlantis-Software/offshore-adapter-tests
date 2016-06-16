var Offshore = require('offshore');
var assert = require('assert');
var _ = require('lodash');

describe('Transaction cross adapter', function() {

  var rollbackError = new Error('rollback');
  
  describe('Commit', function() {

    it('should make a cross-adapter transaction', function(done) {
      var customerName = 'Cross-adapter trx test';
      var paymentName = 'Cross-adapter trx test 2';

      Offshore.Transaction([Transactable.Customer, Transactable.Payment], function(trx, cb) {
        trx.customer.create({name: customerName}).exec(function(err, item1) {
          if (err) {
            done(err);
          }
          assert(item1);
          assert.equal(item1.name, customerName);
          trx.payment.create({type: paymentName}).exec(function(err, item2) {
            if (err) {
              done(err);
            }
            assert(item2);
            assert.equal(item2.type, paymentName);
            trx.customer.find({name: customerName}).exec(function(err, result1) {
              if (err) {
                return done(err);
              }
              assert.equal(result1.length, 1, 'Should find customer in transaction');
              assert.equal(result1[0].name, customerName);

              trx.payment.find({type: paymentName}).exec(function(err, result2) {
                if (err) {
                  return done(err);
                }
                assert.equal(result2.length, 1, 'Should find payment in transaction');
                assert.equal(result2[0].type, paymentName);
                cb(null, 'ok');
              });
            });
          });
        });
      }).exec(function(err, result) {
        if (err) {
          done(err);
        }
        Transactable.Customer.find({name: customerName}, function(err, customers) {
          if (err) {
            return done(err);
          }
          assert.equal(customers.length, 1, 'Should find commited customer');
          assert.equal(customers[0].name, customerName);
          Transactable.Payment.find({type: paymentName}, function(err, payments) {
            if (err) {
              return done(err);
            }
            assert.equal(payments.length, 1, 'Should find commited payment');
            assert.equal(payments[0].type, paymentName);
            done();
          });
        });
      });
    });

    it('should make a cross-adapter nested create', function(done) {
      var customerName = 'Cross-adapter trx parent';
      var child1 = 'Cross-adapter trx child 1';
      var child2 = 'Cross-adapter trx child 2';

      Offshore.Transaction([Transactable.Customer, Transactable.Payment], function(trx, cb) {
        trx.customer.create({name: customerName, payments: [{type: child1},
            {type: child2}]}).exec(function(err, parent) {
          if (err) {
            done(err);
          }
          assert(parent);
          assert.equal(parent.name, customerName);
          trx.customer.find({name: customerName}).populate('payments').exec(function(err, populatedEntry) {
            if (err) {
              return done(err);
            }
            assert.equal(populatedEntry.length, 1, 'Should find customer');
            assert.equal(populatedEntry[0].id, parent.id);
            assert.equal(populatedEntry[0].name, customerName);
            assert.equal(populatedEntry[0].payments.length, 2, 'Should populate 2 payments');
            assert.equal(populatedEntry[0].payments[0].a_customer, parent.id);
            assert.equal(populatedEntry[0].payments[1].a_customer, parent.id);
            cb(null, 'ok');
          });
        });
      }).exec(function(err, result) {
        if (err) {
          done(err);
        }
        Transactable.Customer.find({name: customerName}).populate('payments').exec(function(err, customers) {
          if (err) {
            return done(err);
          }
          assert.equal(customers.length, 1, 'Should find customer');
          assert.equal(customers[0].name, customerName);
          assert.equal(customers[0].payments.length, 2, 'Should populate 2 payments');
          Transactable.Payment.find({type: [child1, child2]}, function(err, payments) {
            if (err) {
              return done(err);
            }
            assert.equal(payments.length, 2, 'Should find commited payments');
            done();
          });
        });
      });
    });

    it('should make a cross-adapter nested update', function(done) {
      var customerName = 'Cross-adapter update trx parent';
      var child1 = 'Cross-adapter update trx child 1';
      var child2 = 'Cross-adapter update trx child 2';
      var child3 = 'Cross-adapter update trx child 3';

      Transactable.Customer.create({name: customerName, payments: [{type: child1},
          {type: child2}]}, function(err, parent) {
        if (err) {
          done(err);
        }
        assert(parent);
        assert.equal(parent.name, customerName);
        Offshore.Transaction([Transactable.Customer, Transactable.Payment], function(trx, cb) {
          trx.customer.find({name: customerName}).populate('payments').exec(function(err, customers) {
            if (err) {
              return done(err);
            }
            assert.equal(customers.length, 1, 'Should find customer');
            assert.equal(customers[0].id, parent.id);
            assert.equal(customers[0].name, customerName);
            assert.equal(customers[0].payments.length, 2, 'Should populate 2 payments');
            assert.equal(customers[0].payments[0].a_customer, parent.id);
            assert.equal(customers[0].payments[1].a_customer, parent.id);

            customers[0].payments.add({type: child3});
            customers[0].save(function(err) {
              if (err) {
                return done(err);
              }
              trx.customer.find({name: customerName}).populate('payments').exec(function(err, customers) {
                if (err) {
                  return done(err);
                }
                assert.equal(customers.length, 1, 'Should find updated customer');
                assert.equal(customers[0].id, parent.id);
                assert.equal(customers[0].name, customerName);
                assert.equal(customers[0].payments.length, 3, 'Should populate 3 payments');
                cb(null, 'ok');
              });
            });
          });
        }).exec(function(err, result) {
          if (err) {
            done(err);
          }
          Transactable.Customer.find({name: customerName}).populate('payments').exec(function(err, customers) {
            if (err) {
              return done(err);
            }
            assert.equal(customers.length, 1, 'Should find updated customer');
            assert.equal(customers[0].id, parent.id);
            assert.equal(customers[0].name, customerName);
            assert.equal(customers[0].payments.length, 3, 'Should populate 3 payments');
            Transactable.Payment.find({type: [child1, child2, child3]}, function(err, payments) {
              if (err) {
                return done(err);
              }
              assert.equal(payments.length, 3, 'Should find commited payments');
              done();
            });
          });
        });
      });
    });
  });

  describe('Rollback', function() {
    it('should make a cross-adapter transaction rollback', function(done) {
      var customerName = 'Cross-adapter trx rollback test';
      var paymentName = 'Cross-adapter trx rollback test 2';
      Offshore.Transaction([Transactable.Customer, Transactable.Payment], function(trx, cb) {
        trx.customer.create({name: customerName}).exec(function(err, item1) {
          if (err) {
            return done(err);
          }
          assert(item1);
          assert.equal(item1.name, 'Cross-adapter trx rollback test');
          trx.payment.create({type: paymentName}).exec(function(err, item2) {
            if (err) {
              return done(err);
            }
            assert(item2);
            assert.equal(item2.type, paymentName);
            trx.customer.find({name: customerName}).exec(function(err, customers) {
              if (err) {
                return done(err);
              }
              assert.equal(customers.length, 1, 'Should find customer');
              assert.equal(customers[0].name, 'Cross-adapter trx rollback test', 'Should have found the created customer');

              trx.payment.find({type: paymentName}).exec(function(err, payments) {
                if (err) {
                  return done(err);
                }
                assert.equal(payments.length, 1, 'Should find payment');
                assert.equal(payments[0].type, paymentName, 'Should have found the created payment');
                cb(rollbackError);
              });
            });
          });
        });
      }).exec(function(err, result) {
        assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
        assert(!result, 'Rollback should not return results');
        Transactable.Customer.find({name: customerName}, function(err, firstResult) {
          if (err) {
            return done(err);
          }
          assert.equal(firstResult.length, 0, 'Customer creation should have been rollbacked');
          Transactable.Payment.find({type: paymentName}, function(err, secondResult) {
            if (err) {
              return done(err);
            }
            assert.equal(secondResult.length, 0, 'Payment creation should have been rollbacked');
            done();
          });
        });
      });
    });

    it('should make a cross-adapter nested create rollback', function(done) {
      var parentName = 'Cross-adapter trx rollback parent';
      var child1 = 'Cross-adapter trx rollback child 1';
      var child2 = 'Cross-adapter trx rollback child 2';

      Offshore.Transaction([Transactable.Customer, Transactable.Payment], function(trx, cb) {
        trx.customer.create({name: parentName, payments: [{type: child1},
            {type: child2}]}).exec(function(err, parent) {
          if (err) {
            return done(err);
          }
          assert(parent);
          assert.equal(parentName, parent.name);
          trx.customer.find({name: parentName}).populate('payments').exec(function(err, populatedEntry) {
            if (err) {
              return done(err);
            }
            assert.equal(populatedEntry.length, 1, 'Should find created data before rollback');
            populatedEntry = populatedEntry[0];
            assert.equal(populatedEntry.id, parent.id);
            assert.equal(populatedEntry.name, parentName);
            assert.equal(populatedEntry.payments.length, 2, 'Should populate 2 payments in transaction');
            assert.equal(populatedEntry.payments[0].a_customer, parent.id);
            assert.equal(populatedEntry.payments[1].a_customer, parent.id);
            cb(rollbackError);
          });
        });
      }).exec(function(err, result) {
        assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
        assert(!result, 'Rollback should not return results');
        Transactable.Customer.find({name: parentName}, function(err, firstResult) {
          if (err) {
            return done(err);
          }
          assert.equal(firstResult.length, 0, 'Parent creation should have been rollbacked');
          Transactable.Payment.find({type: [child1, child2]}, function(err, secondResult) {
            if (err) {
              return done(err);
            }
            assert.equal(secondResult.length, 0, 'Children creation should have been rollbacked');
            done();
          });
        });
      });
    });

    it('should make a cross-adapter nested update rollback', function(done) {
      var parentName = 'Cross-adapter update trx rollback parent';
      var child1 = 'Cross-adapter update trx rollback child 1';
      var child2 = 'Cross-adapter update trx rollback child 2';
      var child3 = 'Cross-adapter update trx rollback child 3';
      Transactable.Customer.create({name: parentName, payments: [{type: child1},
          {type: child2}]}, function(err, parent) {
        if (err) {
          return done(err);
        }
        assert(parent);
        assert.equal(parent.name, parentName);

        Offshore.Transaction([Transactable.Customer, Transactable.Payment], function(trx, cb) {
          trx.customer.find({name: parentName}).populate('payments').exec(function(err, customers) {
            if (err) {
              return done(err);
            }
            assert.equal(customers.length, 1, 'Should find customer');
            assert.equal(customers[0].id, parent.id);
            assert.equal(customers[0].name, parentName);
            assert.equal(customers[0].payments.length, 2, 'Should populate 2 payments');
            assert.equal(customers[0].payments[0].a_customer, parent.id);
            assert.equal(customers[0].payments[1].a_customer, parent.id);

            customers[0].payments.add({type: child3});
            customers[0].save(function(err) {
              if (err) {
                return done(err);
              }
              trx.customer.find({name: parentName}).populate('payments').exec(function(err, updatedCustomers) {
                if (err) {
                  return done(err);
                }
                assert.equal(updatedCustomers.length, 1, 'Should find updated customer in transaction');
                assert.equal(updatedCustomers[0].id, parent.id);
                assert.equal(updatedCustomers[0].name, parentName);
                assert.equal(updatedCustomers[0].payments.length, 3, 'Should populate 3 payments in transaction');
                cb(rollbackError);
              });
            });
          });
        }).exec(function(err, result) {
          assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
          assert(!result, 'Rollback should not return results');
          Transactable.Customer.find({name: parentName}, function(err, customers) {
            if (err) {
              return done(err);
            }
            assert.equal(customers.length, 1, 'Should not alter customers original data');
            Transactable.Payment.find({type: [child1, child2, child3]}, function(err, payments) {
              if (err) {
                return done(err);
              }
              assert.equal(payments.length, 2, 'Should not alter payments original data');
              done();
            });
          });
        });
      });
    });
  });

});