module.exports = {

  tableName: 'stadiumCustomTable',
  identity: 'stadiumCustom',

  autoPK: false,

  attributes: {
    address: {
      type: 'string',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    teams: {
      collection: 'teamcustom',
      through: 'venuecustom',
      via: 'stadium'
    }
  }

};
