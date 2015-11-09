/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'safe',
  connection: 'migratable',
  migrate: 'safe',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
