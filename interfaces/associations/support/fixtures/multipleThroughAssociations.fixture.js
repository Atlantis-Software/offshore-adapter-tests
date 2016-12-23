module.exports.team = {

  tableName: 'teamManyTable',
  identity: 'teamMany',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'teamManyName'
    },
    mascot: {
      type: 'string',
      columnName: 'teamManyMascot'
    },
    stadiums: {
      collection: 'stadiumMany',
      through: 'venueMany',
      via: 'team'
    },
    nativeStadiums: {
      collection: 'stadiumMany',
      through: 'venueMany',
      via: 'nativeTeam'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.mascot;
      return obj;
    }
  }

};

module.exports.stadium = {

  tableName: 'stadiumManyTable',
  identity: 'stadiumMany',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'stadiumManyName'
    },
    teams: {
      collection: 'teamMany',
      through: 'venueMany',
      via: 'stadium'
    },
    nativeTeams: {
      collection: 'teamMany',
      through: 'venueMany',
      via: 'nativeStadium'
    }
  }

};

module.exports.venue = {

  tableName: 'venueManyTable',
  identity: 'venueMany',
  connection: 'associations',

  attributes: {
    seats: {
      type: 'integer',
      columnName: 'venueManySeats'
    },
    team: {
      model: 'teamMany',
      columnName: 'teamMany_id'
    },
    nativeTeam: {
      model: 'teamMany',
      columnName: 'nativeTeamMany_id'
    },
    stadium: {
      model: 'stadiumMany',
      columnName: 'stadiumMany_id'
    },
    nativeStadium: {
      model: 'stadiumMany',
      columnName: 'nativeStadiumMany_id'
    }
  }

};
