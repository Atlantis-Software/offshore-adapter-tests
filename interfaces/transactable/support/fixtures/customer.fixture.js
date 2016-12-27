module.exports = {
  tableName: 'customerTrxTable',
  identity: 'customer',
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
    capital: {
      type: 'integer'
    },
    payments: {
      collection: 'Payment',
      via: 'a_customer'
    },
    stores:{
      collection: 'store',
      via: 'customer',
      through: 'storecustomer'
    }
  }
};
