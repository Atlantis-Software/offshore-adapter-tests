/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  tableName: 'storeCustomerTrxTable',
  identity: 'storecustomer',
  connection: 'transactable',
  migrate: 'alter',
  attributes: {
    customer:{
      model:'customer'
    },
    store: {
      model: 'store'
    }
  }
});
