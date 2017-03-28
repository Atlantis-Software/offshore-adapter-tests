module.exports = {

  identity: 'RideDeep',
  tableName: 'rideDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    taxi: {
      model: 'TaxiDeep'
    },
    driver: {
      model: 'DriverDeep'
    },
    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  }
};
