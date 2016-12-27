module.exports = {

  tableName: 'customerTable',
  identity: 'customer',

  attributes: {
    name: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    capital : {
      type: 'integer'
    },
    payments: {
      collection: 'Payment',
      via: 'a_customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

};
