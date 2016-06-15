/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  tableName: 'customerTrxTable',
  identity: 'customer',
  connection: 'transactable',
  migrate: 'alter',
  attributes: {
    id: {
      columnName: 'ID',
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      "columnName": "NAME",
      type: 'string'
    },
    capital: {
      "columnName": "CAPITAL",
      type: 'integer'
    },
    payments: {
      collection: 'Payment',
      via: 'a_customer'
    }
  }
});
