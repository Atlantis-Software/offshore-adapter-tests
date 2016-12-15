/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'paymentTable',
  identity: 'payment',
  connection: 'associations2',

  attributes: {
    amount: {
      type: 'integer',
      columnName: 'paymentTableAmount'
    },
    type: {
      type: 'string',
      columnName: 'paymentTableType'
    },
    apartment: {
      model: 'apartment',
      columnName: 'apartment_id'
    },
    a_customer: {
      model: 'Customer',
      columnName: 'customer_id'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

});
