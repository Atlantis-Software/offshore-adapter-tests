var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'compositePrimaryKey',
  tableName: 'compositePrimaryKeyTable',
  connection: 'compositePrimaryKeyConnection',
  autoPK: false,

  attributes: {
    name: {
      type: 'string',
      columnName: 'compositePrimaryKeyName'
    },
    pkOne: {
      type: 'integer',
      columnName: 'compositePrimaryKeyPkOne',
      primaryKey: true
    },
    pkTwo: {
      type: 'string',
      columnName: 'compositePrimaryKeyPkTwo',
      primaryKey: true
    }
  }

});
