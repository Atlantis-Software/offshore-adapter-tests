module.exports = {

  tableName: 'paymentbelongsPKTable',
  identity: 'paymentbelongscustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    invoice: {
      type: 'integer',
      primaryKey: true,
      columnName: 'paymentbelongscustomInvoice'
    },
    amount: {
      type: 'integer',
      columnName: 'paymentbelongscustomAmount'
    },
    type: {
      type: 'string',
      columnName: 'paymentbelongscustomString'
    },
    customer: {
      model: 'Customerbelongscustom',
      columnName: 'customer_belongs'
    }
  }

};
