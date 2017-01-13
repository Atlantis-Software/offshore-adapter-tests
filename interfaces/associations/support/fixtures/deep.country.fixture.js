module.exports = {

  identity: 'CountryDeep',
  tableName: 'countryDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    sellers: {
      collection: 'SellerDeep',
      via: 'countries'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
};
