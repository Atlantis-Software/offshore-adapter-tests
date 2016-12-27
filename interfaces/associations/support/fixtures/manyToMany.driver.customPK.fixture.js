module.exports = {

  tableName: 'driverTableCustomPK',
  identity: 'drivercustom',

  autoPK: false,

  attributes: {
    number: {
      type: 'integer',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    taxis: {
      collection: 'taxicustom',
      via: 'drivers',
      dominant: true
    }
  }
};
