var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'compositeUnique',
  tableName: 'compositeUniqueTable',
  connection: 'compositeUniqueConnection',

  attributes: {
    name: 'string',
    uniqueOne: {
      type: 'string',
      unique: {
        unique: false,
        composite: [ 'uniqueTwo' ]
      }
    },

    uniqueTwo: {
      type: 'string',
      unique: {
        unique: false,
        composite: [ 'uniqueOne' ]
      }
    }
  }

});

