/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'stadiumCustomTable',
  identity: 'stadiumCustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    address: {
      type: 'string',
      primaryKey: true,
      columnName: 'customAddress'
    },
    name: {
      type: 'string',
      columnName: 'customName'
    },
    teams: {
      collection: 'teamcustom',
      through: 'venuecustom',
      via: 'stadium'
    }
  }

});
