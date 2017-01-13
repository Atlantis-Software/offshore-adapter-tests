module.exports = {

  tableName: 'driverWithSchemaTable',
  meta: {
    schemaName: 'foo'
  },
  identity: 'driverwithschema',

  attributes: {
    name: {
      type: 'string'
    },
    taxis: {
      collection: 'taxiwithschema',
      via: 'drivers',
      dominant: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
};
