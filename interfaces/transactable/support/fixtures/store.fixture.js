module.exports = {
  tableName: 'storeTrxTable',
  identity: 'store',
  connection: 'transactable',
  migrate: 'alter',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      type: 'string'
    },
    customers:{
      collection: 'customer',
      via: 'store',
      through: 'storecustomer'
    }
  }
};
