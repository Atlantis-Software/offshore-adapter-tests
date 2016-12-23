module.exports = {
  identity: 'Ride',
  connection: 'deep',
  tableName: 'ride_table',
  attributes: {
    id: {
      columnName: 'rideId',
      type: 'integer',
      primaryKey: true
    },
    taxi: {
      model: 'Taxi',
      columnName: 'rideTaxi'
    },
    driver: {
      model: 'Driver',
      columnName: 'rideDriver'
    }
  }
};
