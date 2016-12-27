/**
 * Module Dependencies
 */

var Offshore = require('offshore'),
    _ = require('lodash');

// Require Fixtures
var fixtures = {
  Customer: require('./fixtures/customer.fixture'),
  Payment: require('./fixtures/payment.fixture'),
  Receipt: require('./fixtures/receipt.fixture'),
  Store: require('./fixtures/store.fixture'),
  StoreCustomer: require('./fixtures/storecustomer.fixture')
};


module.exports = function(newFixtures, cb) {
  if(!cb) {
    cb = newFixtures;
    newFixtures = undefined;
  }
  newFixtures = newFixtures || {};
  fixtures = _.defaults(newFixtures, fixtures);

  var offshore = new Offshore();

  Object.keys(fixtures).forEach(function(key) {
    var collection = fixtures[key];
    _.keys(collection.attributes).forEach(function(attr) {
      // skip collection
      if (collection.attributes[attr].collection) {
        return;
      }
      // skip functions
      if (_.isFunction(collection.attributes[attr])) {
        return;
      }
      // add columnName
      collection.attributes[attr].columnName = collection.identity + _.capitalize(attr);
    });
    offshore.loadCollection(Offshore.Collection.extend(collection));
  });
  var connections = { transactable: Connections.test , transactable2: Connections.test2};

  offshore.initialize({ adapters: { wl_tests: Adapter, wl_tests2: Adapter }, connections: connections }, function(err, _ontology) {
    if(err) return cb(err);
    cb(null, { offshore: offshore, ontology: _ontology });
  });

};
