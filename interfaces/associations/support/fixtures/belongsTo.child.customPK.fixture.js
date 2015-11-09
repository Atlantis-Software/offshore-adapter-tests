/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'paymentbelongsPKTable',
  identity: 'paymentbelongscustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    invoice: {
      type: 'integer',
      primaryKey: true
    },
    amount: 'integer',
    type: 'string',
    customer: {
      model: 'Customerbelongscustom',
      columnName: 'customer_belongs'
    }
  }

});
