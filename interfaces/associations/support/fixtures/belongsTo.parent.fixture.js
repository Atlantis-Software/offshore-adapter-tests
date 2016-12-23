module.exports = {

  tableName: 'customerbelongsTable',
  identity: 'customerbelongs',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'customerbelongsName'
    },
    title: {
      type: 'string',
      columnName: 'customerbelongsTitle'
    },
    capital : {
      type: 'integer',
      columnName: 'customerCapital'
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
