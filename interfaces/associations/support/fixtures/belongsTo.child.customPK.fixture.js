module.exports = {

  tableName: 'paymentbelongsPKTable',
  identity: 'paymentbelongscustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    invoice: {
      type: 'integer',
      primaryKey: true
    },
    amount: {
      type: 'integer'
    },
    type: {
      type: 'string'
    },
    customer: {
      model: 'Customerbelongscustom'
    }
  }

};
