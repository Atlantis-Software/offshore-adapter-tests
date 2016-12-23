/**
 * Module Dependencies
 */

var Offshore = require('offshore');
var _ = require('lodash');
var async = require('async');

// Require Fixtures
var associationsFixturesPath = '../../../interfaces/associations/support/';

var fixtures = {
  PaymentBelongsFixture: require(associationsFixturesPath + 'fixtures/belongsTo.child.fixture'),
  PaymentBelongsCustomFixture: require(associationsFixturesPath + 'fixtures/belongsTo.child.customPK.fixture'),
  CustomerBelongsFixture: require(associationsFixturesPath + 'fixtures/belongsTo.parent.fixture'),
  CustomerBelongsCustomFixture: require(associationsFixturesPath + 'fixtures/belongsTo.parent.customPK.fixture'),
  PaymentHasManyFixture: require(associationsFixturesPath + 'fixtures/hasMany.child.fixture'),
  CustomerHasManyFixture: require(associationsFixturesPath + 'fixtures/hasMany.parent.fixture'),
  ApartmentHasManyFixture: require(associationsFixturesPath + 'fixtures/hasMany.customPK.fixture'),
  PaymentManyFixture: require(associationsFixturesPath + 'fixtures/multipleAssociations.fixture').payment,
  CustomerManyFixture: require(associationsFixturesPath + 'fixtures/multipleAssociations.fixture').customer,
  TeamManyFixture: require(associationsFixturesPath + 'fixtures/multipleThroughAssociations.fixture').team,
  StadiumManyFixture: require(associationsFixturesPath + 'fixtures/multipleThroughAssociations.fixture').stadium,
  VenueManyFixture: require(associationsFixturesPath + 'fixtures/multipleThroughAssociations.fixture').venue,
  StadiumFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.stadium.fixture'),
  TeamFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.team.fixture'),
  VenueFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.venue.fixture'),
  StadiumCustomFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.parent.customPK.fixture'),
  TeamCustomFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.child.customPK.fixture'),
  VenueCustomFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.through.customPK.fixture'),
  VenueFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.venue.fixture'),
  TaxiFixture: require(associationsFixturesPath + 'fixtures/manyToMany.taxi.fixture'),
  DriverFixture: require(associationsFixturesPath + 'fixtures/manyToMany.driver.fixture'),
  TaxiWithSchemaFixture: require(associationsFixturesPath + './fixtures/manyToMany.taxi.withSchema.fixture'),
  DriverWithSchemaFixture: require(associationsFixturesPath + './fixtures/manyToMany.driver.withSchema.fixture'),
  TaxiCustomFixture: require(associationsFixturesPath + 'fixtures/manyToMany.taxi.customPK.fixture'),
  DriverCustomFixture: require(associationsFixturesPath + 'fixtures/manyToMany.driver.customPK.fixture'),
  UserOneFixture: require(associationsFixturesPath + 'fixtures/oneToOne.fixture').user_resource,
  ProfileOneFixture: require(associationsFixturesPath + 'fixtures/oneToOne.fixture').profile,
  UserOneCustomFixture: require(associationsFixturesPath + 'fixtures/oneToOne.customPK.fixture').user_resource,
  ProfileOneCustomFixture: require(associationsFixturesPath + 'fixtures/oneToOne.customPK.fixture').profile,
  UserOneManyFixture: require(associationsFixturesPath + 'fixtures/multipleOneToOneAssociations.fixture').user_resource,
  ProfileOneManyFixture: require(associationsFixturesPath + 'fixtures/multipleOneToOneAssociations.fixture').profile
};

fixtures.CustomerBelongsFixture.connection = 'associations2';
fixtures.CustomerBelongsCustomFixture.connection = 'associations2';
fixtures.CustomerHasManyFixture.connection = 'associations2';
fixtures.CustomerManyFixture.connection = 'associations2';
fixtures.VenueManyFixture.connection = 'associations2';
fixtures.VenueFixture.connection = 'associations2';
fixtures.VenueCustomFixture.connection = 'associations2';
fixtures.TaxiFixture.connection = 'associations2';
fixtures.UserOneFixture.connection = 'associations2';
fixtures.UserOneManyFixture.connection = 'associations2';
fixtures.UserOneCustomFixture.connection = 'associations2';

/////////////////////////////////////////////////////
// TEST SETUP
////////////////////////////////////////////////////

var offshore, ontology;

before(function(done) {

  offshore = new Offshore();

  Object.keys(fixtures).forEach(function(key) {
    offshore.loadCollection(Offshore.Collection.extend(fixtures[key]));
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
