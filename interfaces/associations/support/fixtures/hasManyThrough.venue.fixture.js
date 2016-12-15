/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'venueTable',
  identity: 'venue',
  connection: 'associations',

  attributes: {
    seats: {
      type: 'integer',
      columnName: 'venueSeats'
    },
    team: {
      model: 'team',
      columnName: 'team_id'
    },
    stadium: {
      model: 'stadium',
      columnName: 'stadium_id'
    }
  }

});
