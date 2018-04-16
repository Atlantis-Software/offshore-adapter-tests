/**
 * Dependencies
 */

var Offshore = require(process.env.offshorePath || 'offshore');

module.exports = Offshore.Collection.extend({

  identity: 'unique',
  tableName: 'uniqueTable',
  connection: 'uniqueConn',

  attributes: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string',
      unique: true
    },
    type: {
      type: 'string'
    }
  }

});
