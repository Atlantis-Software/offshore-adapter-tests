/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  identity: 'Company',
  connection: 'deep',
  tableName: 'company_table',
  attributes: {
    id: {
      columnName: 'companyId',
      type: 'integer',
      primaryKey: true
    },
    name: {
      columnName: 'companyName',
      type: 'string'
    },
    taxis: {
      collection: 'Taxi',
      via: 'company'
    },
    drivers: {
      collection: 'Driver',
      via: 'company'
    }
  }
});
