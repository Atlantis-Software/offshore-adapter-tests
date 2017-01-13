module.exports = {

  tableName: 'venueCustomTable',
  identity: 'venueCustom',

  attributes: {
    seats: {
      type: 'integer'
    },
    team: {
      model: 'teamcustom'
    },
    stadium: {
      model: 'stadiumcustom'
    }
  }

};
