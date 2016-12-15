/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({

  identity: 'loadtest',
  tableName: 'loadTestTable',
  adapter: 'test',

  attributes: {
    first_name: {
      type: 'string',
      columnName: 'loadtestFirstName'
    },
    last_name: {
      type: 'string',
      columnName: 'loadtestLastName'
    },
    email: {
      type: 'string',
      columnName: 'emailAddress'
    },
    title: {
      type: 'string',
      columnName: 'loadtestTitle'
    },
    phone: {
      type: 'string',
      columnName: 'loadtestPhone'
    },
    type: {
      type: 'string',
      columnName: 'loadtestType'
    },
    favoriteFruit: {
      defaultsTo: 'blueberry',
      type: 'string',
      columnName: 'loadtestFavoriteFruit'
    },
    age: {
      type: 'string',
      columnName: 'loadtestAge'
    }, // integer field that's not auto-incrementable
    dob: {
      type: 'datetime',
      columnName: 'loadtestDob'
    },
    status: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'loadtestStatus'
    },
    percent: {
      type: 'float',
      columnName: 'loadtestPercent'
    },
    list: {
      type: 'array',
      columnName: 'loadtestList'
    },
    obj: {
      type: 'json',
      columnName: 'loadtestObj'
    },
    fullName: function() {
      return this.first_name + ' ' + this.last_name;
    }
  }

});
