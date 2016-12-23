module.exports = {

  tableName: 'apartmentTable',
  identity: 'apartment',
  connection: 'associations',
  autoPK: false,

  attributes: {
    building: {
      type: 'string',
      columnName: 'apartmentBuilding'
    },
    number: {
      type: 'string',
      primaryKey: true,
      unique: true,
      columnName: 'apartmentNumber'
    },
    payments: {
      collection: 'Payment',
      via: 'apartment'
    }
  }

};
