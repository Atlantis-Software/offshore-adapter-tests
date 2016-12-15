/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'unique',
  tableName: 'uniqueTable',
  connection: 'uniqueConn',

  attributes: {
    name: {
      type: 'string',
      columnName: 'uniqueName'
    },
    email: {
      type: 'string',
      unique: true
    },
    type: {
      type: 'string',
      columnName: 'uniqueType'
    }
  }

});
