module.exports = {
  identity: 'Seller',
  connection: 'deep',
  tableName: 'seller_table',
  attributes: {
    id: {
      columnName: 'sellerId',
      type: 'integer',
      primaryKey: true
    },
    name: {
      columnName: 'sellerName',
      type: 'string'
    },
    taxis: {
      collection: 'Taxi',
      via: 'seller'
    },
    departments: {
      collection: 'Department',
      via: 'seller'
    },
    countries: {
      collection: 'Country',
      via: 'sellers'
    }
  }
};
