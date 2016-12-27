module.exports.team = {

  tableName: 'teamManyTable',
  identity: 'teamMany',

  attributes: {
    name: {
      type: 'string'
    },
    mascot: {
      type: 'string'
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

  attributes: {
    name: {
      type: 'string'
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

  attributes: {
    seats: {
      type: 'integer'
    },
    team: {
      model: 'teamMany'
    },
    nativeTeam: {
      model: 'teamMany'
    },
    stadium: {
      model: 'stadiumMany'
    },
    nativeStadium: {
      model: 'stadiumMany'
    }
  }

};
