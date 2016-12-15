/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'taxiTable',
  identity: 'taxi',
  connection: 'associations2',

  // migrate: 'drop',
  attributes: {
    medallion: {
      type: 'integer',
      columnName: 'taxiTableMedallion'
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
});
