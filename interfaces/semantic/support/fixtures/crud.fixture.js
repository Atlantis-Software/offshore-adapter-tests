module.exports = {

  identity: 'user',
  tableName: 'userTable',
  connection: 'semantic',

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
    avatar: {
      type: 'binary'
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
      type: 'integer'
    }, // integer field that's not auto-incrementable
    dob: {
      type: 'datetime'
    },
    birthday: {
      type: 'date'
    },
    dailyDelivery: {
      type: 'time'
    },
    description: {
      type: 'text'
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

};
