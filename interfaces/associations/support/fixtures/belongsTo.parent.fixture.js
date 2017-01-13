module.exports = {

  tableName: 'customerbelongsTable',
  identity: 'customerbelongs',

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
      collection: 'Paymentbelongs',
      via: 'customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

};
