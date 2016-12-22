/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'venueCustomTable',
  identity: 'venueCustom',
  connection: 'associations',

  attributes: {
    seats: {
      type: 'integer',
      columnName: 'venueSeats'
    },
    team: {
      model: 'teamcustom',
      columnName: 'team_id'
    },
    stadium: {
      model: 'stadiumcustom',
      columnName: 'stadium_id'
    }
  }

});
