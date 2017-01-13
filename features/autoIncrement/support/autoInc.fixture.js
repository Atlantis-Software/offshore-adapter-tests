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
      type: 'string'
    },
    normalField: {
      type: 'integer'
    },
    type: {
      type: 'string'
    },
  }

});
