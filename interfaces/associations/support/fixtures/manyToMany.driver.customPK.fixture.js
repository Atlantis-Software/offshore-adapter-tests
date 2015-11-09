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
      primaryKey: true
    },
    name: 'string',
    taxis: {
      collection: 'taxicustom',
      via: 'drivers',
      dominant: true
    }
  }
});
