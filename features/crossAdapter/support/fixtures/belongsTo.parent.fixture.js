/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'customerbelongsTable',
  identity: 'customerbelongs',
  connection: 'associations2',

  attributes: {
    name: {
      type: 'string',
      columnName: 'customerbelongsTableName'
    },
    title: {
      type: 'string',
      columnName: 'customerbelongsTableTitle'
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
