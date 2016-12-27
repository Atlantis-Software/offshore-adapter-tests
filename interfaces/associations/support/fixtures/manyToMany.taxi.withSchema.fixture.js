module.exports = {

  tableName: 'taxiWithSchemaTable',
  meta: {
    schemaName: 'bar'
  },
  identity: 'taxiwithschema',

  attributes: {
    medallion: {
      type: 'integer'
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
