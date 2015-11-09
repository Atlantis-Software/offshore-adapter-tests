/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'unique',
  tableName: 'uniqueTable',
  connection: 'uniqueConn',

  attributes: {
    name: 'string',
    email: {
      type: 'string',
      unique: true
    },
    type: 'string'
  }

});
