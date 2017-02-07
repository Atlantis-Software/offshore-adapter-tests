module.exports = {

  tableName: 'taxiDeepTable',
  identity: 'taxiDeep',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    matricule: {
      type: 'string'
    },
    drivers: {
      collection: 'DriverDeep',
      via: 'taxi',
      through: 'rideDeep'
    },
    company: {
      model: 'CompanyDeep'
    },
    seller: {
      model: 'SellerDeep'
    },
    breakdowns: {
      collection: 'BreakDownDeep',
      via: 'taxi'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.matricule;
      return obj;
    }
  }
};
