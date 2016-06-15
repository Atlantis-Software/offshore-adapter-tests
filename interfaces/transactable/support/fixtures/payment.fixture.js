/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  tableName: 'paymentTrxTable',
  identity: 'payment',
  connection: 'transactable2',
  migrate: 'alter',
  attributes: {
    id: {
      columnName: 'ID',
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    type: {
      "columnName": "TYPE",
      type: 'string'
    },
    a_customer: {
      model: 'Customer',
      columnName: 'customer_id'
    },
    receipts: {
      collection: 'Receipt',
      via: 'a_payment'
    }
  }
});
