module.exports = {

  tableName: 'venueTable',
  identity: 'venue',

  attributes: {
    seats: {
      type: 'integer'
    },
    team: {
      model: 'team'
    },
    stadium: {
      model: 'stadium'
    }
  }

};
