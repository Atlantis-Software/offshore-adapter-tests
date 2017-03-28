var _ = require('lodash');
var assert = require('assert');
var async = require('async');

describe('Association Interface', function() {

  describe('Deep Associations', function() {
    var nestedSellers;
    var nestedCompanies;
    before(function(done) {
      Associations.Companydeep.createEach([
        {
          name: 'company 1',
          drivers: [
            {
              name: 'driver 1',
              address: {city: 'city 1'}
            },
            {
              name: 'driver 3',
              address: {city: 'city 3'}
            }
          ]
        },
        {
          name: 'company 2',
          drivers: [
            {
              name: 'driver 2',
              address: {city: 'city 2'}
            },
            {
              name: 'driver 4',
              address: {city: 'city 4'}
            }
          ]
        }
      ]).exec(function(err, companies) {
        if(err) {
          return done(err);
        }
        _.forEach(companies, function(company, companyIndex) {
          companies[companyIndex].drivers = _.sortBy(companies[companyIndex].drivers, 'name');
        });
        nestedCompanies = companies;
        Associations.Countrydeep.createEach([
          {name: 'france'},
          {name: 'germany'}
        ]).exec(function(err, countries) {
          nestedCreates = [
            {
              name: 'seller 1',
              countries: [
                countries[0].id,
                countries[1].id
              ],
              departments: [
                {name: 'dep 1'},
                {name: 'dep 2'},
                {name: 'dep 4'}
              ],
              taxis: [
                {
                  matricule: 'taxi_1',
                  company: companies[0].id,
                  breakdowns: [
                    {level: 9},
                    {level: 9}
                  ],
                  drivers: [
                    companies[0].drivers[0].id,
                    companies[1].drivers[0].id
                  ]
                },
                {
                  matricule: 'taxi_4',
                  company: companies[0].id,
                  breakdowns: [
                    {level: 10}
                  ],
                  drivers: [
                    companies[0].drivers[0].id
                  ]
                },
                {
                  matricule: 'taxi_5',
                  company: companies[0].id,
                  breakdowns: [
                    {level: 11}
                  ],
                  drivers: [
                    companies[0].drivers[0].id
                  ]
                }
              ]
            },
            {
              name: 'seller 2',
              countries: [
                countries[0].id
              ],
              departments: [
                {name: 'dep 3'},
                {name: 'dep 5'}
              ],
              taxis: [
                {
                  matricule: 'taxi_2',
                  company: companies[1].id,
                  breakdowns: [
                    {level: 7}
                  ],
                  drivers: [
                    companies[1].drivers[0].id,
                    companies[0].drivers[1].id
                  ]
                },
                {
                  matricule: 'taxi_3',
                  company: companies[1].id,
                  breakdowns: [
                    {level: 5},
                    {level: 1},
                    {level: 8}
                  ],
                  drivers: [
                    companies[0].drivers[1].id
                  ]
                }
              ]
            }
          ];

          Associations.Sellerdeep.createEach(nestedCreates).exec(function(err, sellers) {
            if(err) {
              return done(err);
            }
            nestedSellers = sellers;
            done();
          });
        });
      });
    });

    describe('Populate', function() {
      it('should deeply populate a branch', function(done) {
        Associations.Companydeep.find().sort('id asc')
          .populate('drivers', {sort: {name: 1}})
          .populate('drivers.taxis', {sort: {matricule: 1}})
          .populate('drivers.taxis.seller', {sort: {name: 1}})
          .populate('drivers.taxis.seller.departments', {sort: {name: 1}})
          .exec(function(err, companies) {
            assert.ifError(err);
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
            assert(taxi1.seller, 'Could not populate third level manyToOne model.');
            var seller1 = taxi1.seller;
            var seller2 = taxi2.seller;
            assert(seller1.name === 'seller 1' && seller2.name === 'seller 2',
              'Third level not correctly populated.');
            //Level 4
            assert(seller1.departments.length === 3, 'Could not populate fourth level oneToMany collection.');
            assert(seller1.departments[0].name === 'dep 1' && seller1.departments[1].name === 'dep 2'
              && seller1.departments[2].name === 'dep 4', 'Fourth level not correctly populated.');
            assert(seller2.departments.length === 2, 'Could not populate fourth level oneToMany collection.');
            assert(seller2.departments[0].name === 'dep 3',
              'Fourth level not correctly populated.');
            done();
          });
      });

      it('should deeply populate multiple branchs', function(done) {
        Associations.Companydeep.find().where({name: 'company 2'})
          .populate('drivers', {sort: {name: 1}})
          .populate('drivers.taxis', {sort: {matricule: 1}})
          .populate('drivers.address', {sort: {city: 1}})
          .populate('taxis')
          .exec(function(err, companies) {
            assert.ifError(err);
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
        Associations.Companydeep.find().where({name: 'company 1'})
          .populate('drivers', {name: 'driver 3'})
          .populate('drivers.taxis', {matricule: 'taxi_3'})
          .populate('drivers.taxis.breakdowns', {where: {level: {'>': 2}}, sort: {level: 1}})
          .exec(function(err, companies) {
            assert.ifError(err);
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
        Associations.Companydeep.find().where({name: 'compagny 2'})
          .populate('taxis', {sort: 'matricule asc'})
          .populate('taxis.breakdowns')
          .exec(function(err, company) {
            assert.ifError(err);
            assert.strictEqual(company[0].taxis[0].breakdowns.length, 1);
            assert.strictEqual(company[0].taxis[1].breakdowns.length, 3);
            done();
          });
      });

      it('findOne with populate deep should return undefined if there is no results', function(done) {
        Associations.Companydeep.findOne().where({id: 999})
          .populate('taxis')
          .populate('taxis.breakdowns')
          .exec(function(err, company) {
            assert.ifError(err);
            assert(company === void(0));
            done();
          });
      });
    });
    describe('Criteria', function() {
      it('should find model using deep criteria on belongsTo', function(done) {
        Associations.Taxideep.find({where: {seller: {name: 'seller 1'}}}).populate('seller').exec(function(err, taxis) {
          assert.ifError(err);
          assert.strictEqual(taxis.length, 3);
          assert.strictEqual(taxis[0].seller.name, 'seller 1');
          assert.strictEqual(taxis[1].seller.name, 'seller 1');
          assert.strictEqual(taxis[2].seller.name, 'seller 1');
          done();
        });
      });

      it('should find model using deep criteria on hasManyToOne', function(done) {
        Associations.Taxideep.find({where: {breakdowns: {level: 11}}, sort: {matricule: 1}}).populate('breakdowns', {sort: {level: 1}}).exec(function(err, taxis) {
          assert.ifError(err);
          assert.strictEqual(taxis[0].matricule, 'taxi_5');
          assert.strictEqual(taxis[0].breakdowns[0].level, 11);
          done();
        });
      });

      it('should find model using deep criteria on hasManyToMany', function(done) {
        Associations.Sellerdeep.find({where: {countries: {name: 'france'}}, sort: {name: 1}}).populate('countries', {sort: {name: 1}}).exec(function(err, sellers) {
          assert.ifError(err);
          assert(sellers.length === 2);
          assert.strictEqual(sellers[0].countries[0].name, 'france');
          assert.strictEqual(sellers[1].countries[0].name, 'france');
          done();
        });
      });

      it('should find model using deep criteria on hasManyToMany through', function(done) {
        Associations.Driverdeep.find({where: {taxis: {matricule: 'taxi_4'}}, sort: {name: 1}}).populate('taxis', {sort: 'matricule'}).exec(function(err, drivers) {
          assert.ifError(err);
          assert.strictEqual(drivers.length, 1);
          assert.strictEqual(drivers[0].name, 'driver 1');
          assert.strictEqual(drivers[0].taxis.length, 3);
          assert.strictEqual(drivers[0].taxis[0].matricule, 'taxi_1');
          assert.strictEqual(drivers[0].taxis[1].matricule, 'taxi_4');
          assert.strictEqual(drivers[0].taxis[2].matricule, 'taxi_5');
          done();
        });
      });

      it('should find model using deep criteria with operator', function(done) {
        Associations.Driverdeep.find({sort: 'name', where: {taxis: {or: [{matricule: 'taxi_1'}, {matricule: 'taxi_2'}]}}}).populate('taxis', {sort: 'matricule'}).exec(function(err, drivers) {
          assert.ifError(err);
          assert.strictEqual(drivers.length, 3);
          assert.strictEqual(drivers[0].name, 'driver 1');
          assert.strictEqual(drivers[0].taxis.length, 3);
          assert.strictEqual(drivers[0].taxis[0].matricule, 'taxi_1');
          assert.strictEqual(drivers[0].taxis[1].matricule, 'taxi_4');
          assert.strictEqual(drivers[0].taxis[2].matricule, 'taxi_5');
          assert.strictEqual(drivers[1].name, 'driver 2');
          assert.strictEqual(drivers[1].taxis.length, 2);
          assert.strictEqual(drivers[1].taxis[0].matricule, 'taxi_1');
          assert.strictEqual(drivers[1].taxis[1].matricule, 'taxi_2');
          assert.strictEqual(drivers[2].name, 'driver 3');
          assert.strictEqual(drivers[2].taxis.length, 2);
          assert.strictEqual(drivers[2].taxis[0].matricule, 'taxi_2');
          assert.strictEqual(drivers[2].taxis[1].matricule, 'taxi_3');
          done();
        });
      });

      it('should find model using deep criteria in operator', function(done) {
        Associations.Driverdeep.find({sort: 'name', where: {or: [{taxis: {matricule: 'taxi_3'}}, {address: {city: 'city 4'}}]}}).populate('taxis', {sort: 'matricule'}).exec(function(err, drivers) {
          assert.ifError(err);
          assert.strictEqual(drivers.length, 2);
          assert.strictEqual(drivers[0].name, 'driver 3');
          assert.strictEqual(drivers[0].taxis.length, 2);
          assert.strictEqual(drivers[0].taxis[0].matricule, 'taxi_2');
          assert.strictEqual(drivers[0].taxis[1].matricule, 'taxi_3');
          assert.strictEqual(drivers[1].name, 'driver 4');
          assert.strictEqual(drivers[1].taxis.length, 0);
          done();
        });
      });

      it('should populate using deep criteria', function(done) {
        Associations.Driverdeep.findOne({name: 'driver 3'}).populate('taxis', {sort: 'matricule', where: {breakdowns: {level: 5}}}).exec(function(err, driver) {
          assert.ifError(err);
          assert.strictEqual(driver.name, 'driver 3');
          assert.strictEqual(driver.taxis.length, 1);
          assert.strictEqual(driver.taxis[0].matricule, 'taxi_3');
          done();
        });
      });

    });

    describe('Associations', function() {

      it('should deeply populate and apply criteria on associations (One-to-One)', function(done) {
        Associations.Taxideep.findOne({where: {matricule: 'taxi_1'}})
          .populate('seller', {where: {name: 'seller 1'}})
          .populate('seller.departments', {name: {contains: '4'}})
          .exec(function(err, taxi) {
            assert.ifError(err);
            // Root Level
            assert(taxi.matricule === 'taxi_1', 'Root criteria not applied.');
            //Level 1
            assert(taxi.seller, 'Could not populate first level with criteria.');
            assert(taxi.seller.name === 'seller 1', 'First level criteria not applied.');
            //Level 2
            assert(taxi.seller.departments, 'Second level not populated.');
            assert(taxi.seller.departments[0].name === 'dep 4', 'Second level criteria not applied.');
            done();
          });
      });

      it('should deeply populate and apply criteria on associations (One-to-Many)', function(done) {
        Associations.Companydeep.findOne({where: {name: 'company 1'}})
          .populate('taxis', {matricule: 'taxi_4'})
          .populate('taxis.breakdowns', {level: 10})
          .exec(function(err, company) {
            assert.ifError(err);
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
        Associations.Driverdeep.findOne({where: {name: 'driver 1'}})
          .populate('taxis', {matricule: 'taxi_4'})
          .populate('taxis.breakdowns', {level: 10})
          .exec(function(err, driver) {
            assert.ifError(err);
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
        Associations.Countrydeep.findOne({name: 'france'})
          .populate('sellers', {name: 'seller 1'})
          .populate('sellers.departments', {name: 'dep 4'})
          .exec(function(err, country) {
            assert.ifError(err);
            assert(country.name === 'france', 'Root criteria not applied.');
            assert(country.sellers, 'Could not populate first level with criteria.');
            assert(country.sellers[0].name === 'seller 1', 'first level criteria not applied.');
            assert(country.sellers[0].departments, 'Second level not populated.');
            assert(country.sellers[0].departments[0].name === 'dep 4', 'Second level criteria not applied.');
            done();
          });
      });

      it('should deeply populate and apply criteria on associations (Many-to-One)', function(done) {
        Associations.Taxideep.findOne({where: {matricule: 'taxi_1'}})
          .populate('seller', {where: {name: 'seller 1'}})
          .populate('seller.departments', {name: {contains: '4'}})
          .exec(function(err, taxi) {
            assert.ifError(err);
            // Root Level
            assert(taxi.matricule === 'taxi_1', 'Root criteria not applied.');
            //Level 1
            assert(taxi.seller, 'Could not populate first level with criteria.');
            assert(taxi.seller.name === 'seller 1', 'First level criteria not applied.');
            //Level 2
            assert(taxi.seller.departments, 'Second level not populated.');
            assert(taxi.seller.departments[0].name === 'dep 4', 'Second level criteria not applied.');
            done();
          });
      });

    });
  });
});
