/**
 * Module Dependencies
 */

var Offshore = require('offshore');
var _ = require('lodash');
var async = require('async');

// Require Fixtures
var fixtures = {
  PaymentBelongsFixture: require('./fixtures/belongsTo.child.fixture'),
  PaymentBelongsCustomFixture: require('./fixtures/belongsTo.child.customPK.fixture'),
  CustomerBelongsFixture: require('./fixtures/belongsTo.parent.fixture'),
  CustomerBelongsCustomFixture: require('./fixtures/belongsTo.parent.customPK.fixture'),
  PaymentHasManyFixture: require('./fixtures/hasMany.child.fixture'),
  CustomerHasManyFixture: require('./fixtures/hasMany.parent.fixture'),
  ApartmentHasManyFixture: require('./fixtures/hasMany.customPK.fixture'),
  PaymentManyFixture: require('./fixtures/multipleAssociations.fixture').payment,
  CustomerManyFixture: require('./fixtures/multipleAssociations.fixture').customer,
  StadiumManyFixture: require('./fixtures/multipleThroughAssociations.fixture').stadium,
  TeamManyFixture: require('./fixtures/multipleThroughAssociations.fixture').team,
  VenueManyFixture: require('./fixtures/multipleThroughAssociations.fixture').venue,
  StadiumFixture: require('./fixtures/hasManyThrough.stadium.fixture'),
  TeamFixture: require('./fixtures/hasManyThrough.team.fixture'),
  StadiumCustomFixture: require('./fixtures/hasManyThrough.parent.customPK.fixture'),
  TeamCustomFixture: require('./fixtures/hasManyThrough.child.customPK.fixture'),
  VenueCustomFixture: require('./fixtures/hasManyThrough.through.customPK.fixture'),
  VenueFixture: require('./fixtures/hasManyThrough.venue.fixture'),
  TaxiFixture: require('./fixtures/manyToMany.taxi.fixture'),
  DriverFixture: require('./fixtures/manyToMany.driver.fixture'),
  TaxiWithSchemaFixture: require('./fixtures/manyToMany.taxi.withSchema.fixture'),
  DriverWithSchemaFixture: require('./fixtures/manyToMany.driver.withSchema.fixture'),
  TaxiCustomFixture: require('./fixtures/manyToMany.taxi.customPK.fixture'),
  DriverCustomFixture: require('./fixtures/manyToMany.driver.customPK.fixture'),
  UserOneFixture: require('./fixtures/oneToOne.fixture').user_resource,
  ProfileOneFixture: require('./fixtures/oneToOne.fixture').profile,
  UserOneCustomFixture: require('./fixtures/oneToOne.customPK.fixture').user_resource,
  ProfileOneCustomFixture: require('./fixtures/oneToOne.customPK.fixture').profile,
  UserOneManyFixture: require('./fixtures/multipleOneToOneAssociations.fixture').user_resource,
  ProfileOneManyFixture: require('./fixtures/multipleOneToOneAssociations.fixture').profile
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
