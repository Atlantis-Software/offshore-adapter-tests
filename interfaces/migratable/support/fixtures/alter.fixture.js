/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'alter',
  connection: 'migratable',
  migrate: 'alter',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
