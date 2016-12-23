module.exports = {
  identity: 'Taxi',
  connection: 'deep2',
  tableName: 'taxi_table',
  attributes: {
    id: {
      columnName: 'taxiId',
      type: 'integer',
      primaryKey: true
    },
    matricule: {
      columnName: 'taxiMatricule',
      type: 'string'
    },
    drivers: {
      collection: 'Driver',
      via: 'taxi',
      through: 'ride'
    },
    company: {
      model: 'Company',
      columnName: 'taxiCompany'
    },
    seller: {
      model: 'Seller',
      columnName: 'taxiSeller'
    },
    breakdowns: {
      collection: 'BreakDown',
      via: 'taxi'
    }
  }
};
