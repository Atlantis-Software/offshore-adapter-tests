/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'customerTable',
  identity: 'customer',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'customerName'
    },
    title: {
      type: 'string',
      columnName: 'customerTitle'
    },
    capital : {
      type: 'integer',
      columnName: 'customerCapital'
    },
    payments: {
      collection: 'Payment',
      via: 'a_customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

});
