/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'customerTable',
  identity: 'customer',
  connection: 'associations',

  attributes: {
    name: 'string',
    title: 'string',
    capital : 'integer',
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
