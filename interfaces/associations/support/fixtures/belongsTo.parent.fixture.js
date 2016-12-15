/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'customerbelongsTable',
  identity: 'customerbelongs',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'customerbelongsName'
    },
    title: {
      type: 'string',
      columnName: 'customerbelongsTitle'
    },
    payments: {
      collection: 'Paymentbelongs',
      via: 'customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

});
