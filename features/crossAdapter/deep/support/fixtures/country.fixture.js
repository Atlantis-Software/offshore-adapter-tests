/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  identity: 'Country',
  connection: 'deep2',
  tableName: 'country_table',
  attributes: {
    id: {
      columnName: 'countryId',
      type: 'integer',
      primaryKey: true
    },
    name: {
      type: 'string',
      columnName: 'countryName'
    },
    constructors: {
      collection: 'Constructor',
      via: 'countries'
    }
  }
});
