module.exports = {

  identity: 'BreakdownDeep',
  tableName: 'breakdownDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    level: {
      type: 'integer'
    },
    taxi: {
      model: 'TaxiDeep'
    },
    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  }
};
