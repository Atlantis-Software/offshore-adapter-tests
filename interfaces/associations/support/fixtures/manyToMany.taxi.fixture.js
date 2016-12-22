/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'taxiTable',
  identity: 'taxi',
  connection: 'associations',

  // migrate: 'drop',
  attributes: {
    medallion: {
      type: 'integer',
      columnName: 'taxiMedallion'
    },
    type: {
      type: 'string',
      columnName: 'taxiType'
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
