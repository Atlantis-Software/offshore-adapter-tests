var assert = require('assert');
var _ = require('lodash');

describe('compositeUnique feature', function () {
  var Offshore = require(process.env.offshorePath || 'offshore');
  var defaults = { migrate: 'alter' };
  var offshore;

  var Fixture = require('./../support/fixture.js');
  var Model;


  before(function(done) {
    offshore = new Offshore();
    offshore.loadCollection(Fixture);

    var connections = { compositeUniqueConnection: _.clone(Connections.test) };

    Adapter.teardown('compositeUniqueConnection', function adapterTeardown(){
      offshore.initialize({ adapters: { wl_tests: Adapter }, connections: connections, defaults: defaults }, function(err, ontology) {
        if(err) return done(err);
        Model = ontology.collections['compositeunique'];
        done();
      });
    });
  });
  after(function(done) {
    if(!Adapter.hasOwnProperty('drop')) {
      offshore.teardown(done);
    } else {
      Model.drop(function(err1) {
        offshore.teardown(function(err2) {
          return done(err1 || err2);
        });
      });
    }
  });

  it('should insert unique values', function (done) {
    var records = [
      { name: '1st', uniqueOne: 'foo', uniqueTwo: 'bar' },
      { name: '2nd', uniqueOne: 'foo', uniqueTwo: 'baz' },
      { name: '3rd', uniqueOne: 'bar', uniqueTwo: 'bar' },
      { name: '4th', uniqueOne: 'bar', uniqueTwo: 'baz' }
    ];

    Model.create(records)
      .then(function (records) {
        assert(records.length, 4);
        done();
      })
      .catch(done)
  })
  it('should enforce composite uniqueness', function (done) {
    var records = [
      { name: '5th', uniqueOne: 'foo', uniqueTwo: 'bar' }
    ];
    Model.create(records)
      .then(function (records) {
        done(new Error('should not have inserted unique records, but did anyway'));
      })
      .catch(function (err) {
        assert(err)
        done();
      })
  })
})
