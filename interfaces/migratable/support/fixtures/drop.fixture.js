/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'drop',
  connection: 'migratable',
  migrate: 'drop',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
