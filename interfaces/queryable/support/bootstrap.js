/**
 * Module Dependencies
 */

var Offshore = require(process.env.offshorePath || 'offshore');
var _ = require('lodash');
var asynk = require('asynk');

// Require Fixtures
var fixtures = {
  UserFixture: require('./fixtures/crud.fixture')
};


/////////////////////////////////////////////////////
// TEST SETUP
////////////////////////////////////////////////////

var offshore, ontology;

before(function(done) {

  offshore = new Offshore();

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

  var connections = { queryable: _.clone(Connections.test) };

  offshore.initialize({ adapters: { wl_tests: Adapter }, connections: connections }, function(err, _ontology) {
    if(err) return done(err);

    ontology = _ontology;

    Object.keys(_ontology.collections).forEach(function(key) {
      var globalName = key.charAt(0).toUpperCase() + key.slice(1);
      global.Queryable[globalName] = _ontology.collections[key];
    });

    done();
  });
});

after(function(done) {

  function dropCollection(item, next) {
    if (!Adapter.hasOwnProperty('drop')) {
      return next();
    }

    ontology.collections[item].drop(function(err) {
      if (err) {
        return next(err);
      }
      next();
    });
  }

  asynk.each(Object.keys(ontology.collections), dropCollection).serie().asCallback(function(err) {
    if (err) {
      return done(err);
    }
    offshore.teardown(done);
  });

});
