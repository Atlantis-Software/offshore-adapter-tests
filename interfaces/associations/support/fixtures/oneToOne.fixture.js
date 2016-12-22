/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports.user_resource = Offshore.Collection.extend({

  tableName: 'user_resourceTable',
  identity: 'user_resource',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'user_resourceName'
    },
    quantity: {
      type: 'integer',
      columnName: 'user_resourceQuantity'
    },
    profile: {
      model: 'profile',
      columnName: 'profile_id'
    },


    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }


});

module.exports.profile = Offshore.Collection.extend({

  tableName: 'profileTable',
  identity: 'profile',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'profileName'
    },
    level : {
      type: 'integer',
      columnName: 'profileLevel'
    },
    user: {
      model: 'user_resource',
      columnName: 'user_resource_id'
    },


    toJSON: function() {
      var obj = this.toObject();
      delete obj.level;
      return obj;
    }
  }

});
