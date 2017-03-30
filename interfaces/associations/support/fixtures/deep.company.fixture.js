module.exports = {

  identity: 'CompanyDeep',
  tableName: 'companyDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string'
    },
    taxis: {
      collection: 'TaxiDeep',
      via: 'company'
    },
    drivers: {
      collection: 'DriverDeep',
      via: 'company'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
};
