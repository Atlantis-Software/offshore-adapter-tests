module.exports = {

  tableName: 'taxiTableCustomPK',
  identity: 'taxicustom',

  autoPK: false,

  attributes: {
    vin: {
      type: 'string',
      primaryKey: true
    },
    medallion: {
      type: 'integer'
    },
    drivers: {
      collection: 'drivercustom',
      via: 'taxis'
    }
  }
};
