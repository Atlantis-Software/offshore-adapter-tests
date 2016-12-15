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
      columnName: 'customerId',
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      columnName: 'customerName',
      type: 'string'
    },
    capital: {
      columnName: 'customerCapital',
      type: 'integer'
    },
    payments: {
      collection: 'Payment',
      via: 'a_customer'
    },
    stores:{
      collection: 'store',
      via: 'customer',
      through: 'storecustomer'
    }
  }
});
