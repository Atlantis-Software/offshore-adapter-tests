module.exports = {
  identity: 'Country',
  connection: 'deep2',
  tableName: 'country_table',
  attributes: {
    id: {
      columnName: 'countryId',
      type: 'integer',
      primaryKey: true
    },
    name: {
      type: 'string',
      columnName: 'countryName'
    },
    sellers: {
      collection: 'Seller',
      via: 'countries'
    }
  }
};
