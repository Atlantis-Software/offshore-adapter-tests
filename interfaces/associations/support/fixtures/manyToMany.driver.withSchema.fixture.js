/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'driverWithSchemaTable',
  meta: {
    schemaName: 'foo'
  },
  identity: 'driverwithschema',
  connection: 'associations',

  // migrate: 'drop',
  attributes: {
    name: {
      type: 'string',
      columnName: 'driverwithschemaName'
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
});
