/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'driverTableCustomPK',
  identity: 'drivercustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    number: {
      type: 'integer',
      primaryKey: true,
      columnName: 'drivercustomNumber'
    },
    name: {
      type: 'string',
      columnName: 'drivercustomName'
    },
    taxis: {
      collection: 'taxicustom',
      via: 'drivers',
      dominant: true
    }
  }
});
