var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('SKIP LIMIT SORT Query Modifier with associations', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      var Customers = [];

      Customers.push({name: 'skipLimitSort1', title: 'skipLimitSort', capital: 10000, payments: []});
      Customers.push({name: 'skipLimitSort2', title: 'skipLimitSort', capital: 25000, payments: []});
      Customers.push({name: 'skipLimitSort3', title: 'skipLimitSort', capital: 32000, payments: []});
      Customers.push({name: 'skipLimitSort4', title: 'skipLimitSort', capital: 25000, payments: []});
      
      Customers[1].payments.push({amount: 150, type: 'a'});
      Customers[1].payments.push({amount: 350, type: 'b'});
      Customers[1].payments.push({amount: 180, type: 'c'});
      Customers[1].payments.push({amount: 180, type: 'd'});

      Associations.Customer.createEach(Customers, function(err) {
        if(err) {
          return done(err);
        }
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return the correct records', function(done) {
      Associations.Customer.find({ where: { title: 'skipLimitSort' }, limit: 2, skip: 1, sort: {capital: 1, name: 0} })
        .populate('payments', { limit: 2, skip: 1, sort: {amount: 1, type: 0} })
        .exec(function(err, customers) {
        assert.ifError(err);
        assert(Array.isArray(customers));
        assert.strictEqual(customers.length, 2);
        assert.strictEqual(customers[0].name, 'skipLimitSort4');
        assert.strictEqual(customers[1].name, 'skipLimitSort2');
        assert(Array.isArray(customers[1].payments));
        assert.strictEqual(customers[1].payments.length, 2);
        assert.strictEqual(customers[1].payments[0].type, 'd');
        assert.strictEqual(customers[1].payments[1].type, 'c');
        done();
      });
    });

  });
});
