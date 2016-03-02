/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'create',
  connection: 'migratable',
  migrate: 'create',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
