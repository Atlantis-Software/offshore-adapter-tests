module.exports = {

  tableName: 'teamCustomTable',
  identity: 'teamCustom',
  connection: 'associations',

  autoPk: false,

  attributes: {
    location: {
      type: 'string',
      primaryKey: true,
      columnName: 'customLocation'
    },
    name: {
      type: 'string',
      columnName: 'customName'
    },
    mascot: {
      type: 'string',
      columnName: 'customMascot'
    },
    stadiums: {
      collection: 'stadiumcustom',
      through: 'venuecustom',
      via: 'team'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.mascot;
      return obj;
    }
  }

};
