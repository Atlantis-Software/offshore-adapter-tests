module.exports = {

  tableName: 'driverTable',
  identity: 'driver',

  attributes: {
    name: {
      type: 'string'
    },
    drivingTime: {
      type: 'integer'
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
