/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'autoInc',
  tableName: 'autoIncTable',
  connection: 'autoIncConn',

  attributes: {
    name: {
      type: 'string',
      columnName: 'autoIncName'
    },
    normalField: {
      type: 'integer',
      columnName: 'autoIncNormalField'
    },
    type: {
      type: 'string',
      columnName: 'column_type'
    },
  }

});
