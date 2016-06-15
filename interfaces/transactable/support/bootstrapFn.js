/**
 * Module Dependencies
 */

var Offshore = require('offshore'),
    _ = require('lodash');

// Require Fixtures
var fixtures = {
  Customer: require('./fixtures/customer.fixture'),
  Payment: require('./fixtures/payment.fixture'),
  Receipt: require('./fixtures/receipt.fixture')
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
    offshore.loadCollection(fixtures[key]);
  });
  var connections = { transactable: Connections.test , transactable2: Connections.test2};

  offshore.initialize({ adapters: { wl_tests: Adapter, wl_tests2: Adapter }, connections: connections }, function(err, _ontology) {
    if(err) return cb(err);
    cb(null, { offshore: offshore, ontology: _ontology });
  });

};