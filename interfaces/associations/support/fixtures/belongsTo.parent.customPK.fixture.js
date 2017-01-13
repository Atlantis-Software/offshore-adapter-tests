module.exports = {

  tableName: 'customerbelongsPKTable',
  identity: 'customerbelongscustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    username: {
      type: 'string',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    payments: {
      collection: 'Paymentbelongscustom',
      via: 'customer'
    }
  }

};
