/**
 * Module Dependencies
 */

var Offshore = require('offshore');
var _ = require('lodash');
var async = require('async');


var fixtures = {  
  AddressFixture: require('./fixtures/address.fixture'),
  BreakdownFixture: require('./fixtures/breakdown.fixture'),
  CompanyFixture: require('./fixtures/company.fixture'),
  ConstructorFixture: require('./fixtures/constructor.fixture'),
  CountryFixture: require('./fixtures/country.fixture'),
  DepartementFixture: require('./fixtures/departement.fixture'),
  DriverFixture: require('./fixtures/driver.fixture'),
  RideFixture: require('./fixtures/ride.fixture'),
  TaxiFixture: require('./fixtures/taxi.fixture')
};


/////////////////////////////////////////////////////
// TEST SETUP
////////////////////////////////////////////////////

var offshore, ontology;

before(function(done) {

  offshore = new Offshore();

  Object.keys(fixtures).forEach(function(key) {
    offshore.loadCollection(fixtures[key]);
  });

  var connections = { deep: _.clone(Connections.test), deep2: _.clone(Connections.test2) };

  offshore.initialize({ adapters: { wl_tests: Adapter, wl_tests2: MemoryAdapter }, connections: connections }, function(err, _ontology) {
    if(err) return done(err);

    ontology = _ontology;

    Object.keys(_ontology.collections).forEach(function(key) {
      var globalName = key.charAt(0).toUpperCase() + key.slice(1);
      global.Associations[globalName] = _ontology.collections[key];
    });

    done();
  });
});

after(function(done) {

  function dropCollection(item, next) {
    if(!Adapter.hasOwnProperty('drop')) return next();

    ontology.collections[item].drop(function(err) {
      if(err) return next(err);
      next();
    });
  }

  async.each(Object.keys(ontology.collections), dropCollection, function(err) {
    if(err) return done(err);
    offshore.teardown(done);
  });

});
