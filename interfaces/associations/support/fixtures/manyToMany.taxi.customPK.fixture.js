/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'taxiTableCustomPK',
  identity: 'taxicustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    vin: {
      type: 'string',
      primaryKey: true,
      columnName: 'taxicustomVin'
    },
    medallion: {
      type: 'integer',
      columnName: 'customerMedallion'
    },
    drivers: {
      collection: 'drivercustom',
      via: 'taxis'
    }
  }
});
