/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'autoInc',
  tableName: 'autoIncTable',
  connection: 'autoIncConn',

  attributes: {
    name: 'string',
    normalField: 'integer',
    type: 'string'
  }

});
