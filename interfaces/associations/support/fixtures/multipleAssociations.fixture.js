module.exports.payment = {

  tableName: 'payment_manyTable',
  identity: 'payment_many',

  attributes: {
    amount: {
      type: 'integer'
    },
    type: {
      type: 'string'
    },
    customer: {
      model: 'customer_many'
    },
    patron: {
      model: 'customer_many'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

};

module.exports.customer = {

  tableName: 'customer_manyTable',
  identity: 'customer_many',

  attributes: {
    name: {
      type: 'string'
    },
    payments: {
      collection: 'payment_many',
      via: 'customer'
    },
    transactions: {
      collection: 'payment_many',
      via: 'patron'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

};
