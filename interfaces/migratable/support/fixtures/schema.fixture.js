/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  tableName: 'document',
  connection: 'migratable',

  attributes: {
    title: {
      type: 'string',
      primaryKey: true
    },

    number: {
      type: 'integer',
      autoIncrement: true
    },

    serialNumber: {
      type: 'string',
      unique: true
    }
  }

});
