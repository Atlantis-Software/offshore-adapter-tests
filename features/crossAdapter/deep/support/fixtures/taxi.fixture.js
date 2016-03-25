/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  identity: 'Taxi',
  connection: 'deep2',
  tableName: 'taxi_table',
  attributes: {
    id: {
      columnName: 'taxiId',
      type: 'integer',
      primaryKey: true
    },
    matricule: {
      columnName: 'taxiMatricule',
      type: 'string'
    },
    drivers: {
      collection: 'Driver',
      via: 'taxi',
      through: 'ride'
    },
    company: {
      model: 'Company'
    },
    constructor: {
      model: 'Constructor'
    },
    breakdowns: {
      collection: 'BreakDown',
      via: 'taxi'
    }
  }
});
