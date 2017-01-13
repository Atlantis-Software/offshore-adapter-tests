module.exports = {

  tableName: 'stadiumTable',
  identity: 'stadium',

  attributes: {
    name: {
      type: 'string'
    },
    budget: {
      type: 'integer'
    },
    teams: {
      collection: 'Team',
      through: 'venue',
      via: 'stadium'
    }
  }

};
