/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'stadiumTable',
  identity: 'stadium',
  connection: 'associations',

  attributes: {
    name: 'string',
    teams: {
      collection: 'Team',
      through: 'venue',
      via: 'stadium'
    }
  }

});
