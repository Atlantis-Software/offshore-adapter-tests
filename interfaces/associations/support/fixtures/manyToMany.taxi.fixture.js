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
