/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  identity: 'Driver',
  connection: 'deep2',
  tableName: 'driver_table',
  attributes: {
    id: {
      columnName: 'driverId',
      type: 'integer',
      primaryKey: true
    },
    name: {
      columnName: 'driverName',
      type: 'string'
    },
    taxis: {
      collection: 'Taxi',
      via: 'driver',
      through: 'ride'
    },
    address: {
      model: 'Address'
    },
    company: {
      model: 'Company'
    }
  }
});
