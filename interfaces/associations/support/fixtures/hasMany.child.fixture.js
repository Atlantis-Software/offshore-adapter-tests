module.exports = {

  tableName: 'paymentTable',
  identity: 'payment',

  attributes: {
    amount: {
      type: 'integer'
    },
    type: {
      type: 'string'
    },
    apartment: {
      model: 'apartment'
    },
    a_customer: {
      model: 'Customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

};
