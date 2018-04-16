/**
 * Dependencies
 */

var Offshore = require(process.env.offshorePath || 'offshore');

module.exports = Offshore.Collection.extend({

  identity: 'loadtest',
  tableName: 'loadTestTable',
  adapter: 'test',

  attributes: {
    first_name: {
      type: 'string'
    },
    last_name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    favoriteFruit: {
      defaultsTo: 'blueberry',
      type: 'string'
    },
    age: {
      type: 'string'
    }, // integer field that's not auto-incrementable
    dob: {
      type: 'datetime'
    },
    status: {
      type: 'boolean',
      defaultsTo: false
    },
    percent: {
      type: 'float'
    },
    list: {
      type: 'array'
    },
    obj: {
      type: 'json'
    },
    fullName: function() {
      return this.first_name + ' ' + this.last_name;
    }
  }

});
