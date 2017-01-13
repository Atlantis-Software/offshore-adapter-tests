/**
 * Module Dependencies
 */

var Offshore = require('offshore'),
    _ = require('lodash');

// Require Fixtures
var fixtures = {
  UserFixture: require('./fixtures/crud.fixture'),
  ProjectFixture: require('./fixtures/schema.fixture'),
  AlterFixture: require('./fixtures/alter.fixture'),
  CreateFixture: require('./fixtures/create.fixture'),
  CustomFixture: require('./fixtures/custom.fixture'),
  DropFixture: require('./fixtures/drop.fixture'),
  SafeFixture: require('./fixtures/safe.fixture')
};


module.exports = function(newFixtures, cb) {
  if(!cb){
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

  var connections = { migratable: _.clone(Connections.test) };

  offshore.initialize({ adapters: { wl_tests: Adapter }, connections: connections }, function(err, _ontology) {
    if(err) return cb(err);
    cb(null, { offshore: offshore, ontology: _ontology });
  });

};
