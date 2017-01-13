module.exports = {

  identity: 'SellerDeep',
  tableName: 'sellerDeepTable',

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
      via: 'seller'
    },
    departments: {
      collection: 'DepartmentDeep',
      via: 'seller'
    },
    countries: {
      collection: 'CountryDeep',
      via: 'sellers'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
};
