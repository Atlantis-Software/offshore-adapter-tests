/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  tableName: 'receiptTrxTable',
  identity: 'receipt',
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
    label: {
      "columnName": "LABEL",
      type: 'string'
    },
    a_payment: {
      model: 'Payment',
      columnName: 'receipt_id'
    }
  }
});
