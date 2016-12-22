/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports.user_resource = Offshore.Collection.extend({

  tableName: 'user_resourceManyTable',
  identity: 'user_resourceMany',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'user_resourceManyName'
    },
    quantity: {
      type: 'integer',
      columnName: 'user_resourceManyQuantity'
    },
    profile: {
      model: 'profileMany',
      columnName: 'profileMany_id'
    },
    profilePvp: {
      model: 'profileMany',
      columnName: 'profilePvpMany_id'
    }
  }

});

module.exports.profile = Offshore.Collection.extend({

  tableName: 'profileManyTable',
  identity: 'profileMany',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'profileManyName'
    },
    level : {
      type: 'integer',
      columnName: 'profileManyLevel'
    },
    user: {
      model: 'user_resourceMany',
      columnName: 'user_resourceMany_id'
    }
  }

});
