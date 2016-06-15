/**
 * Module Dependencies
 */

var bootstrapFn = require('./bootstrapFn'),
    async = require('async');

/////////////////////////////////////////////////////
// TEST SETUP
////////////////////////////////////////////////////

var offshore, ontology;

before(function(done) {

  bootstrapFn(function(err, obj) {
    if(err) {
      console.log('Ontology loading error : ', err);
    }

    ontology = obj.ontology;
    offshore = obj.offshore;

    Object.keys(ontology.collections).forEach(function(key) {
      var globalName = key.charAt(0).toUpperCase() + key.slice(1);
      global.Transactable[globalName] = ontology.collections[key];
    });

    // Store the Offshore object as a global so it can be used in the tests
    global.Transactable.offshore = offshore;

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
