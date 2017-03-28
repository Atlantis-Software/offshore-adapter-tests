/**
 * Module Dependencies
 */

var Offshore = require('offshore');
var _ = require('lodash');
var async = require('async');

// Require Fixtures
var fixtures = require('../../../interfaces/associations/support/fixtures');

// Divide models connection on `associations` and `associations2` by relations
var Cnx = {};
_.keys(fixtures).forEach(function(key) {

  var fixture = fixtures[key];
  var collectionName = fixture.identity.toLowerCase();

  _.keys(fixture.attributes).forEach(function(attrKey) {
    if (Cnx[collectionName]) {
      return;
    }
    var attr = fixtures[key].attributes[attrKey];
    var relation = attr.model || attr.collection;
    if (relation && Cnx[relation.toLowerCase()] === 'associations') {
      Cnx[collectionName] = fixture.connection = 'associations2';
    }
  });

  if (!Cnx[collectionName]) {
    Cnx[collectionName] = fixture.connection = 'associations';
  }
});

/////////////////////////////////////////////////////
// TEST SETUP
////////////////////////////////////////////////////

var offshore, ontology;

before(function(done) {
  this.timeout(60000);
  offshore = new Offshore();

  // create all collection and load them
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

  var connections = { associations: _.clone(Connections.test), associations2: _.clone(Connections.test2) };

  // in case previous teardown failed
  Adapter.teardown('associations', function adapterTeardown(){

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
});

after(function(done) {
  this.timeout(60000);
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
