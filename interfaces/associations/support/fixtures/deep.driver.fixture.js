module.exports = {

  identity: 'DriverDeep',
  tableName: 'driverDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    taxis: {
      collection: 'TaxiDeep',
      via: 'driver',
      through: 'rideDeep'
    },
    address: {
      model: 'AddressDeep'
    },
    company: {
      model: 'CompanyDeep'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
};
