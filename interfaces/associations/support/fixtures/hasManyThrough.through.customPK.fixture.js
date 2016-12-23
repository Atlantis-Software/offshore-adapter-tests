module.exports = {

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

};
