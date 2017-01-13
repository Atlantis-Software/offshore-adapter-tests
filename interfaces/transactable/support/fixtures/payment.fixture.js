module.exports = {
  tableName: 'paymentTrxTable',
  identity: 'payment',
  connection: 'transactable2',
  migrate: 'alter',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    type: {
      type: 'string'
    },
    a_customer: {
      model: 'Customer'
    },
    receipts: {
      collection: 'Receipt',
      via: 'a_payment'
    }
  }
};
