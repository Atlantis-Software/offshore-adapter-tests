module.exports = {
  identity: 'Breakdown',
  connection: 'deep',
  tableName: 'breakdown_table',
  attributes: {
    id: {
      columnName: 'breakDownId',
      type: 'integer',
      primaryKey: true
    },
    level: {
      columnName: 'breakDownLevel',
      type: 'integer'
    },
    taxi: {
      model: 'Taxi',
      columnName: 'breakdownTaxi'
    }
  }
};
