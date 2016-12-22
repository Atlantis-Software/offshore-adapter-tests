/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports.user_resource = Offshore.Collection.extend({

  tableName: 'user_resourceCustomTable',
  identity: 'user_resourceCustom',
  connection: 'associations',

  autoPk: false,

  attributes: {
    number: {
      type: 'integer',
      primaryKey: true,
      columnName: 'user_resourceCustomNumber'
    },
    name: {
      type: 'string',
      columnName: 'user_resourceCustomName'
    },
    quantity: {
      type: 'integer',
      columnName: 'user_resourceCustomQuantity'
    },
    profile: {
      model: 'profileCustom',
      columnName: 'profileCustom_id'
    }
  }

});

module.exports.profile = Offshore.Collection.extend({

  tableName: 'profileCustomTable',
  identity: 'profileCustom',
  connection: 'associations',

  autoPk: false,

  attributes: {
    name: {
      type: 'string',
      primaryKey: true,
      columnName: 'profileCustomName'
    },
    level : {
      type: 'integer',
      columnName: 'profileCustomLevel'
    },
    user: {
      model: 'user_resourceCustom',
      columnName: 'user_resourceCustom_id'
    }
  }

});
