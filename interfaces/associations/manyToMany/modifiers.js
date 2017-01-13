var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('ManytoMany Association', function() {
    describe('Modifiers', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var names = ['modifier1', 'modifier2', 'modifier3', 'modifier4'];

      before(function(done) {
        // Check Driver hasManytoMany Taxis
        assert.strictEqual(Associations.Driver.attributes.taxis.collection, 'taxi');
        assert.strictEqual(Associations.Taxi.attributes.drivers.collection, 'driver');

        var Drivers = [];

        Drivers.push({name: 'modifier1', drivingTime: 10000, taxis: []});
        Drivers.push({name: 'modifier2', drivingTime: 25000, taxis: []});
        Drivers.push({name: 'modifier3', drivingTime: 32000, taxis: []});
        Drivers.push({name: 'modifier4', drivingTime: 25000, taxis: []});

        Drivers[1].taxis.push({medallion: 150, type: 'aquaman'});
        Drivers[1].taxis.push({medallion: 350, type: 'batman'});
        Drivers[1].taxis.push({medallion: 180, type: 'catwoman'});
        Drivers[1].taxis.push({medallion: 180, type: 'daredevil'});

        Associations.Driver.createEach(Drivers, function(err) {
          assert.ifError(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should sort with parent asc and child asc', function(done) {
        Associations.Driver.find({name: names, sort: 'name asc'})
          .populate('taxis', {sort: 'type asc'})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[0].name, 'modifier1');
          assert.strictEqual(drivers[1].name, 'modifier2');
          assert.strictEqual(drivers[2].name, 'modifier3');
          assert.strictEqual(drivers[3].name, 'modifier4');

          assert(Array.isArray(drivers[1].taxis));
          assert.strictEqual(drivers[1].taxis.length, 4);
          assert.strictEqual(drivers[1].taxis[0].type, 'aquaman');
          assert.strictEqual(drivers[1].taxis[1].type, 'batman');
          assert.strictEqual(drivers[1].taxis[2].type, 'catwoman');
          assert.strictEqual(drivers[1].taxis[3].type, 'daredevil');

          done();
        });
      });

      it('should sort with parent desc and child desc', function(done) {
        Associations.Driver.find({name: names, sort: 'name desc'})
          .populate('taxis', {sort: 'type desc'})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[3].name, 'modifier1');
          assert.strictEqual(drivers[2].name, 'modifier2');
          assert.strictEqual(drivers[1].name, 'modifier3');
          assert.strictEqual(drivers[0].name, 'modifier4');

          assert(Array.isArray(drivers[2].taxis));
          assert.strictEqual(drivers[2].taxis.length, 4);
          assert.strictEqual(drivers[2].taxis[3].type, 'aquaman');
          assert.strictEqual(drivers[2].taxis[2].type, 'batman');
          assert.strictEqual(drivers[2].taxis[1].type, 'catwoman');
          assert.strictEqual(drivers[2].taxis[0].type, 'daredevil');

          done();
        });
      });

      it('should sort with parent asc and child desc', function(done) {
        Associations.Driver.find({name: names, sort: 'name asc'})
          .populate('taxis', {sort: 'type desc'})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[0].name, 'modifier1');
          assert.strictEqual(drivers[1].name, 'modifier2');
          assert.strictEqual(drivers[2].name, 'modifier3');
          assert.strictEqual(drivers[3].name, 'modifier4');

          assert(Array.isArray(drivers[1].taxis));
          assert.strictEqual(drivers[1].taxis.length, 4);
          assert.strictEqual(drivers[1].taxis[3].type, 'aquaman');
          assert.strictEqual(drivers[1].taxis[2].type, 'batman');
          assert.strictEqual(drivers[1].taxis[1].type, 'catwoman');
          assert.strictEqual(drivers[1].taxis[0].type, 'daredevil');

          done();
        });
      });

      it('should sort with parent desc and child asc', function(done) {
        Associations.Driver.find({name: names, sort: 'name desc'})
          .populate('taxis', {sort: 'type asc'})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[3].name, 'modifier1');
          assert.strictEqual(drivers[2].name, 'modifier2');
          assert.strictEqual(drivers[1].name, 'modifier3');
          assert.strictEqual(drivers[0].name, 'modifier4');

          assert(Array.isArray(drivers[2].taxis));
          assert.strictEqual(drivers[2].taxis.length, 4);
          assert.strictEqual(drivers[2].taxis[0].type, 'aquaman');
          assert.strictEqual(drivers[2].taxis[1].type, 'batman');
          assert.strictEqual(drivers[2].taxis[2].type, 'catwoman');
          assert.strictEqual(drivers[2].taxis[3].type, 'daredevil');

          done();
        });
      });

      it('should sort skip limit with parent asc and child asc', function(done) {
        Associations.Driver.find({name: names, sort: 'name asc'})
          .populate('taxis', {sort: 'type asc', skip: 1, limit: 2})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[0].name, 'modifier1');
          assert.strictEqual(drivers[1].name, 'modifier2');
          assert.strictEqual(drivers[2].name, 'modifier3');
          assert.strictEqual(drivers[3].name, 'modifier4');

          assert(Array.isArray(drivers[1].taxis));
          assert.strictEqual(drivers[1].taxis.length, 2);
          assert.strictEqual(drivers[1].taxis[0].type, 'batman');
          assert.strictEqual(drivers[1].taxis[1].type, 'catwoman');

          done();
        });
      });

      it('should sort skip limit with parent desc and child desc', function(done) {
        Associations.Driver.find({name: names, sort: 'name desc'})
          .populate('taxis', {sort: 'type desc', skip: 1, limit: 2})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[3].name, 'modifier1');
          assert.strictEqual(drivers[2].name, 'modifier2');
          assert.strictEqual(drivers[1].name, 'modifier3');
          assert.strictEqual(drivers[0].name, 'modifier4');

          assert(Array.isArray(drivers[2].taxis));
          assert.strictEqual(drivers[2].taxis.length, 2);
          assert.strictEqual(drivers[2].taxis[1].type, 'batman');
          assert.strictEqual(drivers[2].taxis[0].type, 'catwoman');

          done();
        });
      });

      it('should sort skip limit with parent asc and child desc', function(done) {
        Associations.Driver.find({name: names, sort: 'name asc'})
          .populate('taxis', {sort: 'type desc', skip: 1, limit: 2})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[0].name, 'modifier1');
          assert.strictEqual(drivers[1].name, 'modifier2');
          assert.strictEqual(drivers[2].name, 'modifier3');
          assert.strictEqual(drivers[3].name, 'modifier4');

          assert(Array.isArray(drivers[1].taxis));
          assert.strictEqual(drivers[1].taxis.length, 2);
          assert.strictEqual(drivers[1].taxis[1].type, 'batman');
          assert.strictEqual(drivers[1].taxis[0].type, 'catwoman');

          done();
        });
      });

      it('should sort skip limit with parent desc and child asc', function(done) {
        Associations.Driver.find({name: names, sort: 'name desc'})
          .populate('taxis', {sort: 'type asc', skip: 1, limit: 2})
          .exec(function(err, drivers) {
          assert.ifError(err);

          assert(Array.isArray(drivers));
          assert.strictEqual(drivers.length, 4);
          assert.strictEqual(drivers[3].name, 'modifier1');
          assert.strictEqual(drivers[2].name, 'modifier2');
          assert.strictEqual(drivers[1].name, 'modifier3');
          assert.strictEqual(drivers[0].name, 'modifier4');

          assert(Array.isArray(drivers[2].taxis));
          assert.strictEqual(drivers[2].taxis.length, 2);
          assert.strictEqual(drivers[2].taxis[0].type, 'batman');
          assert.strictEqual(drivers[2].taxis[1].type, 'catwoman');

          done();
        });
      });

      it('should return the correct average', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {average: ['medallion'] })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 1);
          assert.strictEqual(Drivers[0].taxis[0].medallion, 215);
          done();
        });
      });

      it('should return the correct min', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {min: ['medallion'] })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 1);
          assert.strictEqual(Drivers[0].taxis[0].medallion, 150);
          done();
        });
      });

      it('should return the correct max', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {max: ['medallion'] })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 1);
          assert.strictEqual(Drivers[0].taxis[0].medallion, 350);
          done();
        });
      });

      it('should return the correct sum', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {sum: ['medallion'] })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 1);
          assert.strictEqual(Drivers[0].taxis[0].medallion, 860);
          done();
        });
      });

      it('should return records with contains modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {type: {contains: 'at'}, sort: 'type asc' })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 2);
          assert.strictEqual(Drivers[0].taxis[0].type, 'batman');
          assert.strictEqual(Drivers[0].taxis[1].type, 'catwoman');
          done();
        });
      });

      it('should return records with endsWith modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {type: {endsWith: 'man'}, sort: 'type asc' })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 3);
          assert.strictEqual(Drivers[0].taxis[0].type, 'aquaman');
          assert.strictEqual(Drivers[0].taxis[1].type, 'batman');
          assert.strictEqual(Drivers[0].taxis[2].type, 'catwoman');
          done();
        });
      });

      it('should return records with greaterThan modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {medallion: {greaterThan: 160}, sort: 'medallion asc' })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 3);
          assert.strictEqual(Drivers[0].taxis[0].medallion, 180);
          assert.strictEqual(Drivers[0].taxis[1].medallion, 180);
          assert.strictEqual(Drivers[0].taxis[2].medallion, 350);
          done();
        });
      });

      it('should return records with multiple sort array notation', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {sort: ['medallion asc', 'type desc'] })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 4);
          assert.strictEqual(Drivers[0].taxis[0].type, 'aquaman');
          assert.strictEqual(Drivers[0].taxis[1].type, 'daredevil');
          assert.strictEqual(Drivers[0].taxis[2].type, 'catwoman');
          assert.strictEqual(Drivers[0].taxis[3].type, 'batman');
          done();
        });
      });

      it('should return records with in modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {type: ['aquaman', 'daredevil'], sort: 'type desc'})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 2);
          assert.strictEqual(Drivers[0].taxis[0].type, 'daredevil');
          assert.strictEqual(Drivers[0].taxis[1].type, 'aquaman');
          done();
        });
      });

      it('should return records with lessThan modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {medallion: {lessThan: 300}, sort: 'type desc' })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 3);
          assert.strictEqual(Drivers[0].taxis[0].type, 'daredevil');
          assert.strictEqual(Drivers[0].taxis[1].type, 'catwoman');
          assert.strictEqual(Drivers[0].taxis[2].type, 'aquaman');
          done();
        });
      });

      it('should return records with like modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {type: {like: '%at%man'}, sort: 'type desc' })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 2);
          assert.strictEqual(Drivers[0].taxis[0].type, 'catwoman');
          assert.strictEqual(Drivers[0].taxis[1].type, 'batman');
          done();
        });
      });

      it('should return records with limit modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {medallion: 180, limit: 1, sort: 'type desc'})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 1);
          assert.strictEqual(Drivers[0].taxis[0].type, 'daredevil');
          done();
        });
      });

      it('should return records with not modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {medallion: {'!': 180}, sort: 'type desc'})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 2);
          assert.strictEqual(Drivers[0].taxis[0].type, 'batman');
          assert.strictEqual(Drivers[0].taxis[1].type, 'aquaman');
          done();
        });
      });

      it('should return records with notIn modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {type: { '!': ['aquaman', 'daredevil']}, sort: 'type desc'})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 2);
          assert.strictEqual(Drivers[0].taxis[0].type, 'catwoman');
          assert.strictEqual(Drivers[0].taxis[1].type, 'batman');
          done();
        });
      });

      it('should return records with or modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {where: { or: [{type:'batman'}, {medallion: 150}]}, sort: 'type desc'})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 2);
          assert.strictEqual(Drivers[0].taxis[0].type, 'batman');
          assert.strictEqual(Drivers[0].taxis[1].type, 'aquaman');
          done();
        });
      });

      it('should return records with select modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {medallion: 180, select: ['type'], sort: 'type desc'})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 2);
          assert.strictEqual(Drivers[0].taxis[0].type, 'daredevil');
          assert.strictEqual(Drivers[0].taxis[0].medallion, undefined);
          assert.strictEqual(Drivers[0].taxis[1].type, 'catwoman');
          assert.strictEqual(Drivers[0].taxis[1].medallion, undefined);

          done();
        });
      });

      it('should return records with skip modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {medallion: 180, skip: 1, sort: 'type desc'})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 1);
          assert.strictEqual(Drivers[0].taxis[0].type, 'catwoman');
          done();
        });
      });

      it('should return records with startsWith modifier', function(done) {
        Associations.Driver.find({ where: { name: 'modifier2' }})
          .populate('taxis', {type: {startsWith: 'bat'}})
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 1);
          assert.strictEqual(Drivers[0].name, 'modifier2');
          assert(Array.isArray(Drivers[0].taxis));
          assert.strictEqual(Drivers[0].taxis.length, 1);
          assert.strictEqual(Drivers[0].taxis[0].type, 'batman');
          done();
        });
      });

      it('should return the correct records with skip, limit and sort', function(done) {
        Associations.Driver.find({ where: { name: {startsWith: 'modifier'}}, limit: 2, skip: 1, sort: {drivingTime: 1, name: 0} })
          .populate('taxis', { limit: 2, skip: 1, sort: {medallion: 1, type: 0} })
          .exec(function(err, Drivers) {
          assert.ifError(err);
          assert(Array.isArray(Drivers));
          assert.strictEqual(Drivers.length, 2);
          assert.strictEqual(Drivers[0].name, 'modifier4');
          assert.strictEqual(Drivers[1].name, 'modifier2');
          assert(Array.isArray(Drivers[1].taxis));
          assert.strictEqual(Drivers[1].taxis.length, 2);
          assert.strictEqual(Drivers[1].taxis[0].type, 'daredevil');
          assert.strictEqual(Drivers[1].taxis[1].type, 'catwoman');
          done();
        });
      });


    });
  });
});
