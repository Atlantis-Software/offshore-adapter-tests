module.exports = {

  tableName: 'taxiTable',
  identity: 'taxi',

  attributes: {
    medallion: {
      type: 'integer'
    },
    type: {
      type: 'string'
    },
    brand: {
      type: 'string'
    },
    transmission: {
      type: 'string'
    },
    drivers: {
      collection: 'driver',
      via: 'taxis'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.medallion;
      return obj;
    }
  }
};
