/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'venueTable',
  identity: 'venue',
  connection: 'associations2',

  attributes: {
    seats: {
      type: 'integer',
      columnName: 'venueTableSeats'
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
