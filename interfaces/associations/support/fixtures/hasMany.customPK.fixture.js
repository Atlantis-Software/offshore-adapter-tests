/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'apartmentTable',
  identity: 'apartment',
  connection: 'associations',
  autoPK: false,

  attributes: {
    building: 'string',
    number: {
      type: 'string',
      primaryKey: true,
      unique: true
    },
    payments: {
      collection: 'Payment',
      via: 'apartment'
    }
  }

});
