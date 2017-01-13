module.exports = {

  tableName: 'apartmentTable',
  identity: 'apartment',
  autoPK: false,

  attributes: {
    building: {
      type: 'string'
    },
    number: {
      type: 'string',
      primaryKey: true,
      unique: true
    },
    payments: {
      collection: 'Payment',
      via: 'apartment'
    }
  }

};
