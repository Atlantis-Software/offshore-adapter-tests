var Offshore = require('offshore');
var assert = require('assert');
var _ = require('lodash');

describe('Transaction commit', function() {

  it('should commit created data', function(done) {
    var id;
    var customerName = 'Test create transaction';

    Offshore.Transaction(Transactable.Customer, function(trx, cb) {
      trx.customer.create({name: customerName}).exec(function(err, createResult) {
        if (err) {
          return done(err);
        }

        id = createResult.id;
        cb(null, createResult);
      });
    }).exec(function(err, result) {
      if (err) {
        done(err);
      }
      assert(result, 'Exec callback should have returned the updated entry');
      assert.equal(result.id, id);
      Transactable.Customer.find({name: customerName}, function(err, test) {
        if (err) {
          return done(err);
        }
        assert.equal(test.length, 1, 'Customer should be commited');
        done();
      });
    });
  });

  it('should commit updated data', function(done) {
    var id;
    var customerName = 'Test update transaction';
    var updatedName = 'Updated test transaction';

    Offshore.Transaction(Transactable.Customer, function(trx, cb) {
      trx.customer.create({name: customerName}).exec(function(err, createResult) {
        if (err) {
          return done(err);
        }
        id = createResult.id;
        trx.customer.update({id: id}, {name: updatedName}).exec(function(err, updateResult) {
          if (err) {
            return done(err);
          }
          cb(null, updateResult);
        });
      });
    }).exec(function(err, result) {
      if (err) {
        done(err);
      }
      assert(result, 'Exec callback should have returned the updated entry');
      assert.equal(result.length, 1);
      result = result[0];
      assert.equal(result.id, id);
      Transactable.Customer.find({name: customerName}, function(err, test) {
        if (err) {
          return done(err);
        }
        assert.equal(test.length, 0, 'Original customer should be updated');
        Transactable.Customer.find({name: updatedName}, function(err, test) {
          if (err) {
            return done(err);
          }
          assert.equal(test.length, 1, 'Customer should be updated');
          done();
        });
      });
    });
  });

  it('should destroy data', function(done) {
    var id;
    var customerName = 'Test destroy transaction';

    Transactable.Customer.create({name: customerName}, function(err, customer) {
      if (err) {
        return done(err);
      }
      id = customer.id;
      Offshore.Transaction(Transactable.Customer, function(trx, cb) {
        trx.customer.destroy({name: customerName}).exec(function(err, destroyResult) {
          if (err) {
            return done(err);
          }
          cb(null, destroyResult);
        });

      }).exec(function(err, result) {
        if (err) {
          done(err);
        }
        assert(result[0], 'Transaction callback should return the destroyed customer');
        assert.equal(result[0].id, id);
        Transactable.Customer.find({name: customerName}, function(err, test) {
          if (err) {
            return done(err);
          }
          assert.equal(test.length, 0, 'Customer should be destroyed');
          done();
        });
      });
    });
  });

  it('should destroy data in transaction', function(done) {
    var id;
    var customerName = 'Test destroy in transaction';

    Offshore.Transaction(Transactable.Customer, function(trx, cb) {
      trx.customer.create({name: customerName}).exec(function(err, createResult) {
        if (err) {
          return done(err);
        }
        id = createResult.id;
        trx.customer.destroy({name: customerName}).exec(function(err, destroyResult) {
          if (err) {
            return done(err);
          }
          cb(null, destroyResult);
        });
      });
    }).exec(function(err, result) {
      if (err) {
        done(err);
      }
      assert(result[0], 'Transaction callback should return the destroyed customer');
      assert.equal(result[0].id, id);
      Transactable.Customer.find({name: customerName}, function(err, test) {
        if (err) {
          return done(err);
        }
        assert.equal(test.length, 0, 'Customer should be destroyed');
        done();
      });
    });
  });

  it('original model should not interact with transaction', function(done) {
    var id;
    var customerName = 'Test atomicity transaction';

    Offshore.Transaction(Transactable.Customer, function(trx, cb) {
      trx.customer.create({name: customerName}).exec(function(err, createResult) {
        if (err) {
          return done(err);
        }
        id = createResult.id;
        trx.customer.find({id: id}).exec(function(err, findInTrx) {
          if (err) {
            return done(err);
          }
          assert.equal(findInTrx.length, 1, 'Customer should exist inside the transaction');
          Transactable.Customer.find({name: customerName}, function(err, findOutTrx) {
            if (err) {
              return done(err);
            }
            assert.equal(findOutTrx.length, 0, 'Customer should not exist outside the transaction');
            Transactable.Customer.update({id: id}, {name: 'updated atomicity transaction'}).exec(function(err, updateOutTrx) {
              if (err) {
                return done(err);
              }
              assert.equal(updateOutTrx.length, 0, 'Should not update customer before commit without using transaction object');
              Transactable.Customer.destroy({id: id}).exec(function(err, destroyOutTrx) {
                if (err) {
                  return done(err);
                }
                assert.equal(destroyOutTrx.length, 0, 'Should not destroy customer before commit without using transaction object');
                cb(null, createResult);
              });
            });
          });
        });
      });
    }).exec(function(err, result) {
      if (err) {
        done(err);
      }
      assert(result);
      assert.equal(result.id, id);
      Transactable.Customer.find({id: id}, function(err, customer) {
        if (err) {
          return done(err);
        }
        assert.equal(customer.length, 1, 'Should not alter customer');
        assert.equal(customer[0].name, customerName, 'Should not alter customer');
        done();
      });
    });
  });

  it('should commit without doing anything', function(done) {
    Offshore.Transaction(Transactable.Customer, function(trx, cb) {
      cb(null, 'ok');
    }).exec(function(err, result) {
      if (err) {
        done(err);
      }
      assert(result === 'ok', 'Should commit');
      done();
    });
  });

  it('should perform nested transactions', function(done) {
    var customerName = 'Test transaception';

    Offshore.Transaction(Transactable.Customer, function(trx1, cb1) {
      trx1.customer.create({name: customerName}).exec(function(err, customer1) {
        if (err) {
          return done(err);
        }
        Offshore.Transaction(Transactable.Customer, function(trx2, cb2) {
          trx2.customer.create({name: customerName}).exec(function(err, customer2) {
            if (err) {
              return done(err);
            }
            // Commit second transaction
            cb2(null, customer2);
          });
        }).exec(function(err, result) {
          if (err) {
            done(err);
          }
          // Commit first transaction
          cb1(null, customer1);
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
        assert.equal(customers.length, 2, 'All transactions should be commited');
        assert.equal(customers[0].name, customerName);
        assert.equal(customers[1].name, customerName);
        done();
      });
    });
  });


  it('should populate', function(done) {
    var customerName = 'Parent customer';
    var paymentName = 'Child payment';

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
        Offshore.Transaction([Transactable.Customer, Transactable.Payment], function(trx, cb) {
          trx.customer.findOne({name: customerName}).populate('payments').exec(function(err, populatedCustomer) {
            if (err) {
              return done(err);
            }
            assert.equal(populatedCustomer.name, customerName);
            assert.equal(populatedCustomer.payments.length, 2, 'Should populate 2 payments');
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

  it('should populate through association', function(done) {
    var customerName = 'Through customer';
    var storeName1 = 'Through store 1';
    var storeName2 = 'Through store 2';

    Transactable.Customer.create({name: customerName, stores: [{name: storeName1}, {name: storeName2}]}, function(err, customer) {
      if (err) {
        done(err);
      }
      assert.equal(customer.name, customerName);
      Offshore.Transaction([Transactable.Customer, Transactable.Store], function(trx, cb) {
        trx.customer.findOne({name: customerName}).populate('stores').exec(function(err, populatedCustomer) {
          if (err) {
            return done(err);
          }
          assert.equal(populatedCustomer.name, customerName);
          assert.equal(populatedCustomer.stores.length, 2, 'Should populate 2 stores');
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

  it('should populate undeclared child collections', function(done) {
    var customerName = 'Parent customer 2';
    var paymentName = 'Child payment 2';

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
        Offshore.Transaction(Transactable.Customer, function(trx, cb) {
          trx.customer.findOne({name: customerName}).populate('payments').exec(function(err, populatedCustomer) {
            if (err) {
              return done(err);
            }
            assert.equal(populatedCustomer.name, customerName);
            assert.equal(populatedCustomer.payments.length, 2, 'Should populate payments');
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

  it('should perform nested transactions and commit only one', function(done) {
    var close;
    var customerName = 'Test transaception2';

    Offshore.Transaction(Transactable.Customer, function(trx1, cb1) {
      trx1.customer.create({name: customerName}).exec(function(err, customer1) {
        if (err) {
          return done(err);
        }
        Offshore.Transaction(Transactable.Customer, function(trx2, cb2) {
          trx2.customer.create({name: customerName}).exec(function(err, customer2) {
            if (err) {
              return done(err);
            }
            // Commit only the first transaction and keep second transaction callback
            close = cb2;
            cb1(null, customer1);

          });
        });
      });
    }).exec(function(err, result) {
      if (err) {
        done(err);
      }
      Transactable.Customer.find({name: customerName}, function(err, test) {
        // Close second transaction to free connection
        close(null, 'ok');
        if (err) {
          return done(err);
        }
        assert.equal(test.length, 1, 'Only one customer should be commited');
        assert.equal(test[0].name, customerName);

        done();
      });
    });
  });

  it('should commit through table', function(done) {
    var customerName = 'Through commit customer';
    var storeName1 = 'Through commit store 1';
    var storeName2 = 'Through commit 2';

    Offshore.Transaction([Transactable.Customer, Transactable.Store], function(trx, cb) {
      trx.customer.create({name: customerName, stores: [{name: storeName1}, {name: storeName2}]}).exec(function(err, customer) {
        if (err) {
          done(err);
        }
        assert.equal(customer.name, customerName);
        trx.customer.findOne({name: customerName}).populate('stores').exec(function(err, populatedCustomer) {
          if (err) {
            return done(err);
          }
          assert.equal(populatedCustomer.name, customerName);
          assert.equal(populatedCustomer.stores.length, 2, 'Should populate 2 stores');
          return cb(null, populatedCustomer);
        });
      });
    }).exec(function(err, result) {
      if (err) {
        done(err);
      }
      Transactable.Customer.find({name: customerName}).populate('stores').exec(function(err, customer) {
        if (err) {
          done(err);
        }
        assert.equal(customer.length, 1);
        assert.equal(customer[0].name, customerName);
        assert.equal(customer[0].stores.length, 2, 'Should populate 2 stores');
        Transactable.Store.find({name: storeName1}).populate('customers').exec(function(err, store1) {
          if (err) {
            done(err);
          }
          assert.equal(store1.length, 1);
          assert.equal(store1[0].name, storeName1);
          assert.equal(store1[0].customers.length, 1, 'Should populate 1 customer');
          Transactable.Store.find({name: storeName2}).populate('customers').exec(function(err, store2) {
            if (err) {
              done(err);
            }
            assert.equal(store2.length, 1);
            assert.equal(store2[0].name, storeName2);
            assert.equal(store2[0].customers.length, 1, 'Should populate 1 customer');
            done();
          });
        });
      });
    });
  });

});
