/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  identity: 'Constructor',
  connection: 'deep',
  tableName: 'constructor_table',
  attributes: {
    id: {
      columnName: 'constructorId',
      type: 'integer',
      primaryKey: true
    },
    name: {
      columnName: 'constructorName',
      type: 'string'
    },
    taxis: {
      collection: 'Taxi',
      via: 'constructor'
    },
    departments: {
      collection: 'Department',
      via: 'constructor'
    },
    countries: {
      collection: 'Country',
      via: 'constructors'
    }
  }
});
