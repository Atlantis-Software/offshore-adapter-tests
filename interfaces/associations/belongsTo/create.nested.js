var assert = require('assert');
var _ = require('lodash');
var util = require('util');



describe('Association Interface', function() {

  describe('Belongs To Associations', function() {

    before(function(done) {
      // Check Payment belongsTo Customer
      assert.strictEqual(Associations.Paymentbelongs.attributes.customer.model, 'customerbelongs');
      assert.strictEqual(Associations.Customerbelongs.attributes.payments.collection, 'paymentbelongs');
      done();
    });

    describe('create nested association', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a parent and child record and store the foreign key on the parent', function(done) {
        var data = {
          amount: 200,
          customer: {
            title: 'belongsTo nested create'
          }
        };

        Associations.Paymentbelongs.create(data).exec(function(err, payment) {
          assert.ifError(err);
          assert(payment.customer);

          Associations.Paymentbelongs.findOne(payment.id)
          .populate('customer')
          .exec(function(err, _paymnt) {
            assert(!err,'Tried to execute .findOne() with criteria:\n'+
              util.inspect(payment.id, false, null)+'\nBut got error:\n'+
              util.inspect(err, false, null));
            assert(_paymnt.customer.title === 'belongsTo nested create',
              'Expecting `_paymnt.customer.title`==="belongsTo nested create", but instead `_paymnt` ==>'+
              util.inspect(_paymnt, false, null));
            done();
          });
        });
      });
    });

  });
});
