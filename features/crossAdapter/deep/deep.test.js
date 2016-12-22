var _ = require('lodash');
var assert = require('assert');
var async = require('async');

describe('Deep Cross Adapter', function() {

  describe('Deep Associations', function() {
    before(function(done) {
      async.series([
        function(callback) {
          Associations.Address.createEach([
            {id: 1, city: 'city 1'},
            {id: 2, city: 'city 2'},
            {id: 3, city: 'city 3'},
            {id: 4, city: 'city 4'}
          ], callback);
        },
        function(callback) {
          Associations.Breakdown.createEach([
            {id: 1, level: 5, taxi: 3},
            {id: 2, level: 7, taxi: 2},
            {id: 3, level: 1, taxi: 3},
            {id: 4, level: 8, taxi: 3},
            {id: 5, level: 9, taxi: 1},
            {id: 8, level: 9, taxi: 1},
            {id: 6, level: 10, taxi: 4},
            {id: 7, level: 11, taxi: 5}
          ], callback);
        },
        function(callback) {
          Associations.Company.createEach([
            {id: 1, name: 'company 1'},
            {id: 2, name: 'company 2'}
          ], callback);
        },
        function(callback) {
          Associations.Constructor.createEach([
            {id: 1, name: 'constructor 1'},
            {id: 2, name: 'constructor 2'}
          ], callback);
        },
        function(callback) {
          Associations.Country.createEach([
            {id: 1, name: 'france'},
            {id: 2, name: 'germany'}
          ], callback);
        },
        function(callback) {
          Associations.Department.createEach([
            {id: 1, name: 'dep 1', constructor: 1},
            {id: 2, name: 'dep 2', constructor: 1},
            {id: 3, name: 'dep 3', constructor: 2},
            {id: 4, name: 'dep 4', constructor: 1},
            {id: 5, name: 'dep 5', constructor: 2}
          ], callback);
        },
        function(callback) {
          Associations.Driver.createEach([
            {id: 1, name: 'driver 1', company: 1, address: 1},
            {id: 2, name: 'driver 2', company: 2, address: 2},
            {id: 3, name: 'driver 3', company: 1, address: 3},
            {id: 4, name: 'driver 4', company: 2, address: 4}
          ], callback);
        },
        function(callback) {
          Associations.Ride.createEach([
            {id:1, taxi: 1, driver: 1},
            {id:2, taxi: 4, driver: 1},
            {id:3, taxi: 5, driver: 1},
            {id:4, taxi: 2, driver: 2},
            {id:5, taxi: 1, driver: 2},
            {id:6, taxi: 3, driver: 3},
            {id:7, taxi: 2, driver: 3}
          ], callback);
        },
        function(callback) {
          Associations.Taxi.createEach([
            {id: 1, matricule: 'taxi_1', company: 1, constructor: 1},
            {id: 2, matricule: 'taxi_2', company: 2, constructor: 2},
            {id: 3, matricule: 'taxi_3', company: 2, constructor: 2},
            {id: 4, matricule: 'taxi_4', company: 1, constructor: 1},
            {id: 5, matricule: 'taxi_5', company: 1, constructor: 1}
          ], callback);
        },
        function(callback) {
          Associations.Country.findOne(1, function(err, country) {
            if (err) {
              return done(err);
            }
            country.constructors.add(1);
            country.constructors.add(2);
            country.save(callback);
          });
        }
      ], done);
    });

    describe('Populate', function() {
      it('should deeply populate a branch', function(done) {
        Associations.Company.find().sort('id asc')
          .populate('drivers.taxis', {sort: {id: 1}})
          .populate('drivers.taxis.constructor.departments', {sort: {id: 1}})
          .exec(function(err, companies) {
            if (err) {
              return done(err);
            }
            // Root Level
            assert.equal(companies.length, 2, 'Root criteria not applied.');
            assert.equal(companies[1].name, 'company 2', 'Root criteria not applied.');
            //Level 1
            assert.equal(companies[1].drivers.length, 2, 'Could not populate first level oneToMany collection.');
            assert.equal(companies[1].drivers[0].name, 'driver 2', 'First level not correctly populated.');

            //Level 2
            assert.equal(companies[1].drivers[0].taxis.length, 2, 'Could not populate second level manyToMany Through collection.');
            var taxi1 = companies[1].drivers[0].taxis[0];
            var taxi2 = companies[1].drivers[0].taxis[1];
            assert.equal(taxi1.matricule, 'taxi_1', 'Second level not correctly populated.');
            assert.equal(taxi2.matricule, 'taxi_2', 'Second level not correctly populated.');
            //Level 3
            assert(taxi1.constructor, 'Could not populate third level manyToOne model.');
            var constructor1 = taxi1.constructor;
            var constructor2 = taxi2.constructor;
            assert(constructor1.name === 'constructor 1' && constructor2.name === 'constructor 2',
              'Third level not correctly populated.');
            //Level 4
            assert(constructor1.departments.length === 3, 'Could not populate fourth level oneToMany collection.');
            assert(constructor1.departments[0].name === 'dep 1' && constructor1.departments[1].name === 'dep 2'
              && constructor1.departments[2].name === 'dep 4', 'Fourth level not correctly populated.');
            assert(constructor2.departments.length === 2, 'Could not populate fourth level oneToMany collection.');
            assert(constructor2.departments[0].name === 'dep 3',
              'Fourth level not correctly populated.');
            done();
          });
      });

      it('should deeply populate multiple branchs', function(done) {
        Associations.Company.find().where({name: 'company 2'})
          .populate('drivers.taxis', {sort: {id: 1}})
          .populate('drivers.address')
          .populate('taxis')
          .exec(function(err, companies) {
            if (err)
              return done(err);
            // Root Level
            assert(companies.length === 1 && companies[0].name === 'company 2', 'Root criteria not applied.');
            //Level 1
            assert(companies[0].drivers.length === 2, 'Could not populate first level oneToMany collection.');
            assert(companies[0].drivers[0].name === 'driver 2', 'First level not correctly populated.');
            assert(companies[0].taxis.length === 2, 'First level not correctly populated.');
            //Level 2 A
            assert(companies[0].drivers[0].taxis.length === 2, 'Could not populate second level manyToMany Through collection.');
            var taxi1 = companies[0].drivers[0].taxis[0];
            assert(taxi1.matricule === 'taxi_1', 'Second level (A) not correctly populated.');
            //Level 2 B
            assert(companies[0].drivers[0].address.city === 'city 2', 'Second level (B) criteria not populated.');
            done();
          });
      });

      it('should apply criteria to current populate path last alias', function(done) {
        Associations.Company.find().where({name: 'company 1'})
          .populate('drivers', {name: 'driver 3'})
          .populate('drivers.taxis', {matricule: 'taxi_3'})
          .populate('drivers.taxis.breakdowns', {where: {level: {'>': 2}}, sort: {level: 1}})
          .exec(function(err, companies) {
            if (err)
              return done(err);
            // Root Level
            assert(companies.length === 1 && companies[0].name === 'company 1', 'Root criteria not applied.');
            //Level 1
            assert(companies[0].drivers.length === 1, 'Could not populate first level oneToMany collection.');
            assert(companies[0].drivers[0].name === 'driver 3', 'First level criteria not applied.');
            //Level 2
            assert(companies[0].drivers[0].taxis.length === 1, 'Could not populate second level manyToMany Through collection.');
            var taxi = companies[0].drivers[0].taxis[0];
            assert(taxi.matricule === 'taxi_3', 'Second level criteria not applied.');
            //Level 3
            assert(taxi.breakdowns.length === 2, 'Could not populate third level oneToMany collection.');
            assert(taxi.breakdowns[0].level === 5 && taxi.breakdowns[1].level === 8, 'Third level criteria not applied.');

            done();
          });
      });

      it('should deeply populate nested collections', function(done) {
        Associations.Company.find().where({id: 2})
          .populate('taxis')
          .populate('taxis.breakdowns')
          .exec(function(err, company) {
            if (err)
              return done(err);
            assert(company[0].taxis[0].breakdowns.length === 1);
            assert(company[0].taxis[1].breakdowns.length === 3);
            done();
          });
      });

      it('findOne with populate deep should return undefined if there is no results', function(done) {
        Associations.Company.findOne().where({id: 999})
          .populate('taxis')
          .populate('taxis.breakdowns')
          .exec(function(err, company) {
            if (err) {
              return done(err);
            }
            assert(company === void(0));
            done();
          });
      });
    });
    describe('Criteria', function() {
      it('should find model using deep criteria on belongsTo', function(done) {
        Associations.Taxi.find({where: {constructor: {name: 'constructor 1'}}}).populate('constructor').exec(function(err, taxis) {
          if (err) {
            return done(err);
          }
          assert(taxis.length === 3);
          assert(taxis[0].constructor.name === 'constructor 1');
          assert(taxis[1].constructor.name === 'constructor 1');
          assert(taxis[2].constructor.name === 'constructor 1');
          done();
        });
      });

      it('should find model using deep criteria on hasManyToOne', function(done) {
        Associations.Taxi.find({where: {breakdowns: {level: 11}}}).populate('breakdowns').exec(function(err, taxis) {
          if (err) {
            return done(err);
          }
          assert(taxis[0].id === 5);
          assert(taxis[0].breakdowns[0].id === 7);
          assert(taxis[0].breakdowns[0].level === 11);
          done();
        });
      });

      it('should find model using deep criteria on hasManyToMany', function(done) {
        Associations.Constructor.find({where: {countries: {name: 'france'}}}).populate('countries').exec(function(err, constructors) {
          if (err) {
            return done(err);
          }
          assert(constructors.length === 2);
          assert(constructors[0].countries[0].name === 'france');
          assert(constructors[1].countries[0].name === 'france');
          done();
        });
      });

      it('should find model using deep criteria on hasManyToMany through', function(done) {
        Associations.Driver.find({where: {taxis: {matricule: 'taxi_4'}}}).populate('taxis', {sort: 'matricule'}).exec(function(err, drivers) {
          if (err) {
            return done(err);
          }
          assert(drivers.length === 1);
          assert(drivers[0].id === 1);
          assert(drivers[0].taxis.length === 3);
          assert(drivers[0].taxis[0].matricule === 'taxi_1');
          assert(drivers[0].taxis[1].matricule === 'taxi_4');
          assert(drivers[0].taxis[2].matricule === 'taxi_5');
          done();
        });
      });

      it('should find model using deep criteria with operator', function(done) {
        Associations.Driver.find({sort: 'id', where: {taxis: {or: [{matricule: 'taxi_1'}, {matricule: 'taxi_2'}]}}}).populate('taxis', {sort: 'matricule'}).exec(function(err, drivers) {
          if (err) {
            return done(err);
          }
          assert(drivers.length === 3);
          assert(drivers[0].id === 1);
          assert(drivers[0].taxis.length === 3);
          assert(drivers[0].taxis[0].matricule === 'taxi_1');
          assert(drivers[0].taxis[1].matricule === 'taxi_4');
          assert(drivers[0].taxis[2].matricule === 'taxi_5');
          assert(drivers[1].id === 2);
          assert(drivers[1].taxis.length === 2);
          assert(drivers[1].taxis[0].matricule === 'taxi_1');
          assert(drivers[1].taxis[1].matricule === 'taxi_2');
          assert(drivers[2].id === 3);
          assert(drivers[2].taxis.length === 2);
          assert(drivers[2].taxis[0].matricule === 'taxi_2');
          assert(drivers[2].taxis[1].matricule === 'taxi_3');
          done();
        });
      });

      it('should find model using deep criteria in operator', function(done) {
        Associations.Driver.find({sort: 'id', where: {or: [{taxis: {matricule: 'taxi_3'}}, {address: {city: 'city 4'}}]}}).populate('taxis', {sort: 'matricule'}).exec(function(err, drivers) {
          if (err) {
            return done(err);
          }
          assert(drivers.length === 2);
          assert(drivers[0].id === 3);
          assert(drivers[0].taxis.length === 2);
          assert(drivers[0].taxis[0].matricule === 'taxi_2');
          assert(drivers[0].taxis[1].matricule === 'taxi_3');
          assert(drivers[1].id === 4);
          assert(drivers[1].taxis.length === 0);
          assert(drivers[1].address === 4);
          done();
        });
      });

      it('should populate using deep criteria', function(done) {
        Associations.Driver.findOne(3).populate('taxis', {sort: 'matricule', where: {breakdowns: {level: 5}}}).exec(function(err, driver) {
          if (err) {
            return done(err);
          }
          assert(driver.taxis.length === 1);
          assert(driver.taxis[0].id === 3);
          done();
        });
      });
    });

    describe('Associations', function() {

      it('should deeply populate and apply criteria on associations (One-to-One)', function(done) {
        Associations.Taxi.findOne({where: {matricule: 'taxi_1'}})
          .populate('constructor', {where: {name: 'constructor 1'}})
          .populate('constructor.departments', {name: {contains: '4'}})
          .exec(function(err, taxi) {
            if (err)
              return done(err);
            // Root Level
            assert(taxi.matricule === 'taxi_1', 'Root criteria not applied.');
            //Level 1
            assert(taxi.constructor, 'Could not populate first level with criteria.');
            assert(taxi.constructor.name === 'constructor 1', 'First level criteria not applied.');
            //Level 2
            assert(taxi.constructor.departments, 'Second level not populated.');
            assert(taxi.constructor.departments[0].name === 'dep 4', 'Second level criteria not applied.');
            done();
          });
      });

      it('should deeply populate and apply criteria on associations (One-to-Many)', function(done) {
        Associations.Company.findOne({where: {name: 'company 1'}})
          .populate('taxis', {matricule: 'taxi_4'})
          .populate('taxis.breakdowns', {level: 10})
          .exec(function(err, company) {
            if (err)
              return done(err);
            // Root Level
            assert(company.name === 'company 1', 'Root criteria not applied.');
            //Level 1
            assert(company.taxis, 'Could not populate first level');
            assert(company.taxis[0].matricule === 'taxi_4', 'First level criteria not applied.');
            //Level 2
            assert(company.taxis[0].breakdowns, 'Second level not populated.');
            assert(company.taxis[0].breakdowns[0].level === 10, 'Second level criteria not applied.');
            done();
          });
      });

      it('should deeply populate and apply criteria on associations (Many-to-Many Through)', function(done) {
        Associations.Driver.findOne({where: {name: 'driver 1'}})
          .populate('taxis', {matricule: 'taxi_4'})
          .populate('taxis.breakdowns', {level: 10})
          .exec(function(err, driver) {
            if (err)
              return done(err);
            // Root Level
            assert(driver.name === 'driver 1', 'Root criteria not applied.');
            //Level 1
            assert(driver.taxis, 'Could not populate first level with criteria.');
            assert(driver.taxis[0].matricule === 'taxi_4', 'first level criteria not applied.');
            //Level 2
            assert(driver.taxis[0].breakdowns, 'Second level not populated.');
            assert(driver.taxis[0].breakdowns[0].level === 10, 'Second level criteria not applied.');
            done();
          });
      });

      it('should deeply populate and apply criteria on associations (Many-to-Many)', function(done) {
        Associations.Country.findOne({name: 'france'})
          .populate('constructors', {name: 'constructor 1'})
          .populate('constructors.departments', {name: 'dep 4'})
          .exec(function(err, country) {
            if (err) {
              done(err);
            }
            assert(country.name === 'france', 'Root criteria not applied.');
            assert(country.constructors, 'Could not populate first level with criteria.');
            assert(country.constructors[0].name === 'constructor 1', 'first level criteria not applied.');
            assert(country.constructors[0].departments, 'Second level not populated.');
            assert(country.constructors[0].departments[0].name === 'dep 4', 'Second level criteria not applied.');
            done();
          });
      });

      it('should deeply populate and apply criteria on associations (Many-to-One)', function(done) {
        Associations.Taxi.findOne({where: {matricule: 'taxi_1'}})
          .populate('constructor', {where: {name: 'constructor 1'}})
          .populate('constructor.departments', {name: {contains: '4'}})
          .exec(function(err, taxi) {
            if (err) {
              return done(err);
            }
            // Root Level
            assert(taxi.matricule === 'taxi_1', 'Root criteria not applied.');
            //Level 1
            assert(taxi.constructor, 'Could not populate first level with criteria.');
            assert(taxi.constructor.name === 'constructor 1', 'First level criteria not applied.');
            //Level 2
            assert(taxi.constructor.departments, 'Second level not populated.');
            assert(taxi.constructor.departments[0].name === 'dep 4', 'Second level criteria not applied.');
            done();
          });
      });
    });
  });
});
