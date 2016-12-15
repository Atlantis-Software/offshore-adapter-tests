/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'customerbelongsPKTable',
  identity: 'customerbelongscustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    username: {
      type: 'string',
      primaryKey: true,
      columnName: 'customerbelongscustomUsername'
    },
    name: {
      type: 'string',
      columnName: 'customerbelongscustomName'
    },
    title: {
      type: 'string',
      columnName: 'customerbelongscustomTitle'
    },
    payments: {
      collection: 'Paymentbelongscustom',
      via: 'customer'
    }
  }

});
