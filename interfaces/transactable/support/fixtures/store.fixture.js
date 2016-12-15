/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  tableName: 'storeTrxTable',
  identity: 'store',
  connection: 'transactable',
  migrate: 'alter',
  attributes: {
    id: {
      columnName: 'storeId',
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      columnName: 'storeName',
      type: 'string'
    },
    customers:{
      collection: 'customer',
      via: 'store',
      through: 'storecustomer'
    }
  }
});
