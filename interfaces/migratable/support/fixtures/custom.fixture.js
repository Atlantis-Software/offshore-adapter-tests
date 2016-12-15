/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  // tableName: 'customTable',
  identity: 'custom',
  connection: 'migratable',
  migrate: 'alter',

  attributes: {
    name: {
    	type: 'string',
    	columnName: 'nameColumn'
    },
    age: {
      type: 'integer',
      columnName: 'customerAge'
    }
  }

});
