module.exports = {

  identity: 'AddressDeep',
  tableName: 'addressDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    city: {
      type: 'string'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.city;
      return obj;
    }
  }
};
