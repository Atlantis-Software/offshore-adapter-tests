/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'user',
  tableName: 'usertablesql',
  connection: 'sql',

  attributes: {
    first_name: {
      type: 'string',
      columnName: 'userFirstName'
    },
    last_name: {
      type: 'string',
      columnName: 'userLastName'
    },
    email: {
      type: 'string',
      columnName: 'emailAddress'
    },
    avatar: {
      type: 'binary',
      columnName: 'userAvatar'
    },
    title: {
      type: 'string',
      columnName: 'userTitle'
    },
    phone: {
      type: 'string',
      columnName: 'userPhone'
    },
    type: {
      type: 'string',
      columnName: 'userType'
    },
    favoriteFruit: {
      defaultsTo: 'blueberry',
      type: 'string',
      columnName: 'userFavoriteFruit'
    },
    age: {
      type: 'integer',
      columnName: 'userAge'
    }, // integer field that's not auto-incrementable
    dob: {
      type: 'datetime',
      columnName: 'userDob'
    },
    status: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'userStatus'
    },
    percent: {
      type: 'float',
      columnName: 'userPercent'
    },
    list: {
      type: 'array',
      columnName: 'arrList'
    },
    obj: {
      type: 'json',
      columnName: 'userObj'
    },
    fullName: function() {
      return this.first_name + ' ' + this.last_name;
    }
  }

});
