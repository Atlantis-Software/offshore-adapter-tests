module.exports = {
  tableName: 'receiptTrxTable',
  identity: 'receipt',
  connection: 'transactable',
  migrate: 'alter',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    label: {
      type: 'string'
    },
    a_payment: {
      model: 'Payment'
    }
  }
};
