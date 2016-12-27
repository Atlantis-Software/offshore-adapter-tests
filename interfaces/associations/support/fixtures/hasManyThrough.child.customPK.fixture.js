module.exports = {

  tableName: 'teamCustomTable',
  identity: 'teamCustom',

  autoPk: false,

  attributes: {
    location: {
      type: 'string',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    mascot: {
      type: 'string'
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
