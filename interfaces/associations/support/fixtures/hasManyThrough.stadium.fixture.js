module.exports = {

  tableName: 'stadiumTable',
  identity: 'stadium',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'stadiumName'
    },
    budget: {
      type: 'integer',
      columnName: 'stadiumBudget'
    },
    teams: {
      collection: 'Team',
      through: 'venue',
      via: 'stadium'
    }
  }

};
