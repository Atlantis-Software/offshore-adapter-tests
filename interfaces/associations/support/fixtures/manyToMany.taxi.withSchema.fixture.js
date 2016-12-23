module.exports = {

  tableName: 'taxiWithSchemaTable',
  meta: {
    schemaName: 'bar'
  },
  identity: 'taxiwithschema',
  connection: 'associations',

  // migrate: 'drop',
  attributes: {
    medallion: {
      type: 'integer',
      columnName: 'taxiwithschemaMedallion'
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
