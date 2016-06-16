var Offshore = require('offshore');
var assert = require('assert');
var _ = require('lodash');

describe('Transaction rollback', function() {

var rollbackError = new Error('rollback');

  it('should rollback the created entry', function(done) {
    var customerName = 'Test create rollback';
    Offshore.Transaction(Transactable.Customer, function(trx, cb) {
      trx.customer.create({name: customerName}).exec(function(err, createResult) {
        if (err) {
          return done(err);
        }
        var id = createResult.id;
        trx.customer.find({id: id}).exec(function(err, findInTrx) {
          if (err) {
            return done(err);
          }
          assert.equal(findInTrx.length, 1, 'Customer should be visible inside the transaction');
          Transactable.Customer.find({id: id}, function(err, findOutTrx) {
            if (err) {
              return done(err);
            }
            assert.equal(findOutTrx.length, 0, 'Customer should not be visible outside the transaction');
            cb(rollbackError);
          });
        });
      });
    }).exec(function(err, result) {
      assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
      assert(!result, 'Rollback should not return results');
      Transactable.Customer.find({name: customerName}, function(err, test) {
        if (err) {
          return done(err);
        }
        assert.equal(test.length, 0, 'Created entry should be rollbacked');
        done();
      });
    });
  });

  it('should rollback without doing anything', function(done) {
    Offshore.Transaction(Transactable.Customer, function(trx, cb) {
      cb(rollbackError);
    }).exec(function(err, result) {
      assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
      assert(!result, 'Rollback should not return results');
      done();
    });
  });

  it('should rollback the delete', function(done) {
    var customerName = 'Test delete rollback';
    Transactable.Customer.create({name: customerName}, function(err, testEntry) {
      if (err) {
        done(err);
      }
      Transactable.Customer.find({name: customerName}, function(err, entry) {
        if (err) {
          done(err);
        }
        assert.equal(entry.length, 1);
        Offshore.Transaction(Transactable.Customer, function(trx, cb) {
          trx.customer.destroy({name: customerName}).exec(function(err, deleteResult) {
            if (err) {
              return done(err);
            }
            cb(rollbackError);
          });
        }).exec(function(err, result) {
          assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
          assert(!result, 'Rollback should not return results');
          Transactable.Customer.find({name: customerName}, function(err, result) {
            if (err) {
              return done(err);
            }
            assert.equal(result.length, 1, 'Customer destroy should be rollbacked');
            done();
          });
        });
      });
    });
  });

  it('should rollback the update', function(done) {
    var customerName = 'Test update rollback';
    var updatedName = 'Updated test rollback';
    Transactable.Customer.create({name: customerName}, function(err, testEntry) {
      if (err) {
        done(err);
      }
      Transactable.Customer.find({name: customerName}, function(err, entry) {
        if (err) {
          done(err);
        }
        assert.equal(entry.length, 1);
        Offshore.Transaction(Transactable.Customer, function(trx, cb) {
          trx.customer.update({name: customerName}, {name: updatedName}).exec(function(err, updatedResult) {
            if (err) {
              return done(err);
            }
            assert.equal(updatedResult.length, 1, 'Should update customer in transaction');
            cb(rollbackError);
          });
        }).exec(function(err, result) {
          assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
          assert(!result, 'should return no results');
          Transactable.Customer.find({name: updatedName}, function(err, result) {
            if (err) {
              return done(err);
            }
            assert.equal(result.length, 0, 'Customer should not be updated');
            Transactable.Customer.find({name: customerName}, function(err, result) {
              if (err) {
                return done(err);
              }
              assert.equal(result.length, 1, 'Original customer should still exist');
              done();
            });
          });
        });
      });
    });
  });

  it('should do a nested transaction and rollback only the first level', function(done) {
    var customerName = 'Test rollback transaception2';
    
    Offshore.Transaction(Transactable.Customer, function(trx1, cb1) {
      trx1.customer.create({name: customerName}).exec(function(err, createResult1) {
        if (err) {
          return done(err);
        }
        Offshore.Transaction(Transactable.Customer, function(trx2, cb2) {
          trx2.customer.create({name: customerName}).exec(function(err, createResult2) {
            if (err) {
              return done(err);
            }
            cb2(null, createResult2);
          });
        }).exec(function(err, result) {
          if (err) {
            done(err);
          }
          cb1(rollbackError);
        });
      });
    }).exec(function(err, result) {
      assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
      assert(!result, 'Rollback should not return results');
      Transactable.Customer.find({name: customerName}, function(err, test) {
        if (err) {
          return done(err);
        }
        assert.equal(test.length, 1, 'Only 1 of the transaction customer should have been commited');
        done();
      });
    });
  });

  it('should rollback through table', function(done) {
    var customerName = 'Through rollback customer';
    var storeName1 = 'Through rollback store 1';
    var storeName2 = 'Through rollback store 2';
    var customerId;
    var store1Id;
    var store2Id;

    Offshore.Transaction([Transactable.Customer, Transactable.Store], function(trx, cb) {
      trx.customer.create({name: customerName, stores: [{name: storeName1}, {name: storeName2}]}).exec(function(err, customer) {
        if (err) {
          done(err);
        }
        assert.equal(customer.name, customerName);
        customerId = customer.id;
        trx.customer.findOne({name: customerName}).populate('stores').exec(function(err, populatedCustomer) {
          if (err) {
            return done(err);
          }
          assert.equal(populatedCustomer.name, customerName);
          assert.equal(populatedCustomer.stores.length, 2, 'Should populate 2 stores');
          store1Id = populatedCustomer.stores[0].id;
          store2Id = populatedCustomer.stores[1].id;
          return cb(rollbackError);
        });
      });
    }).exec(function(err, result) {
      assert(err, rollbackError, 'Exec callback should return error passed in transaction callback');
      assert(!result, 'Rollback should not return results');
      Transactable.Customer.find({name: customerName}).populate('stores').exec(function(err, customer) {
        if (err) {
          done(err);
        }
        assert.equal(customer.length, 0, 'Created customer should be rollbacked');
        Transactable.Store.find({name: storeName1}).populate('customers').exec(function(err, store1) {
          if (err) {
            done(err);
          }
          assert.equal(store1.length, 0, 'Created first store should be rollbacked');
          Transactable.Store.find({name: storeName2}).populate('customers').exec(function(err, store2) {
            if (err) {
              done(err);
            }
            assert.equal(store2.length, 0, 'Created second store be rollbacked');

            Transactable.Storecustomer.find([{customer: customerId}, {store: store1Id}, {store: store2Id}]).exec(function(err, junction) {
              if (err) {
                done(err);
              }
              assert.equal(junction.length, 0, 'Junction entries should be rollbacked');
              done();
            });
          });
        });
      });
    });
  });

});