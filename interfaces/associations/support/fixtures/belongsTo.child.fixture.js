module.exports = {

  tableName: 'paymentbelongsTable',
  identity: 'paymentbelongs',
  connection: 'associations',

  attributes: {
    amount: {
      type: 'integer'
    },
    type: {
      type: 'string'
    },
    customer: {
      model: 'Customerbelongs'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

};
