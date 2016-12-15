/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'paymentbelongsTable',
  identity: 'paymentbelongs',
  connection: 'associations',

  attributes: {
    amount: {
      type: 'integer',
      columnName: 'paymentbelongsAmount'
    },
    type: {
      type: 'string',
      columnName: 'paymentbelongsType'
    },
    customer: {
      model: 'Customerbelongs',
      columnName: 'customer_belongs'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

});
