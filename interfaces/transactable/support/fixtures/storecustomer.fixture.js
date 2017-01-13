module.exports = {
  tableName: 'storeCustomerTrxTable',
  identity: 'storecustomer',
  connection: 'transactable',
  migrate: 'alter',
  attributes: {
    customer:{
      model:'customer'
    },
    store: {
      model: 'store'
    }
  }
};
