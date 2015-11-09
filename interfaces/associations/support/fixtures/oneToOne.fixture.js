/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports.user_resource = Offshore.Collection.extend({

  tableName: 'user_resourceTable',
  identity: 'user_resource',
  connection: 'associations',

  attributes: {
    name: 'string',
    quantity: 'integer',
    profile: {
      model: 'profile',
      columnName: 'profile_id'
    }
  }

});

module.exports.profile = Offshore.Collection.extend({

  tableName: 'profileTable',
  identity: 'profile',
  connection: 'associations',

  attributes: {
    name: 'string',
    level : 'integer',
    user: {
      model: 'user_resource',
      columnName: 'user_resource_id'
    }
  }

});
