/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  identity: 'Address',
  connection: 'deep',
  tableName: 'address_table',
  attributes: {
    id: {
      columnName: 'addressId',
      type: 'integer',
      primaryKey: true
    },
    city: {
      columnName: 'addressCity',
      type: 'string'
    }
  }
});
