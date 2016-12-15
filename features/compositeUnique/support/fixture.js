var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'compositeUnique',
  tableName: 'compositeUniqueTable',
  connection: 'compositeUniqueConnection',

  attributes: {
    name: {
      type: 'string',
      columnName: 'compositeUniqueName'
    },
    uniqueOne: {
      type: 'string',
      columnName: 'compositeUniqueUniqueOne',
      unique: {
        unique: false,
        composite: [ 'uniqueTwo' ]
      }
    },

    uniqueTwo: {
      type: 'string',
      columnName: 'compositeUniqueUniqueTwo',
      unique: {
        unique: false,
        composite: [ 'uniqueOne' ]
      }
    }
  }

});
