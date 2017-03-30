module.exports = {

  identity: 'BreakdownDeep',
  tableName: 'breakdownDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
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
