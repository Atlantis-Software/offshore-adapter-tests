/**
 * Module Dependencies
 */

var Offshore = require('offshore');
var _ = require('lodash');
var async = require('async');

// Require Fixtures
var fixtures = require('./fixtures');


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
    collection.connection = 'associations';
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

  var connections = { associations: _.clone(Connections.test) };

  offshore.initialize({ adapters: { wl_tests: Adapter }, connections: connections }, function(err, _ontology) {
    if (err) {
      return done(err);
    }

    ontology = _ontology;

    Object.keys(_ontology.collections).forEach(function(key) {
      var globalName = key.charAt(0).toUpperCase() + key.slice(1);
      global.Associations[globalName] = _ontology.collections[key];
    });

    done();
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
    if (err) {
      return done(err);
    }
    offshore.teardown(done);
  });

});
