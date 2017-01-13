var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'compositePrimaryKey',
  tableName: 'compositePrimaryKeyTable',
  connection: 'compositePrimaryKeyConnection',
  autoPK: false,

  attributes: {
    name: {
      type: 'string'
    },
    pkOne: {
      type: 'integer',
      primaryKey: true
    },
    pkTwo: {
      type: 'string',
      primaryKey: true
    }
  }

});
