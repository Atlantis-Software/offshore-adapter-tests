module.exports = {

  tableName: 'paymentTable',
  identity: 'payment',
  connection: 'associations',

  attributes: {
    amount: {
      type: 'integer',
      columnName: 'paymentAmount'
    },
    type: {
      type: 'string',
      columnName: 'paymentType'
    },
    apartment: {
      model: 'apartment',
      columnName: 'apartment_id'
    },
    a_customer: {
      model: 'Customer',
      columnName: 'customer_id'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

};
