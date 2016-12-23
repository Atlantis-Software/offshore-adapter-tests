module.exports = {

  tableName: 'driverTable',
  identity: 'driver',
  connection: 'associations',

  // migrate: 'drop',
  attributes: {
    name: {
      type: 'string',
      columnName: 'driverName'
    },
    drivingTime: {
      type: 'integer',
      columnName: 'driverDrivingTime'
    },
    taxis: {
      collection: 'taxi',
      via: 'drivers',
      dominant: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
};
