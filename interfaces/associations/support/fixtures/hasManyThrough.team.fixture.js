module.exports = {

  tableName: 'teamTable',
  identity: 'team',
  connection: 'associations',

  attributes: {
    name: {
      type: 'string',
      columnName: 'stadiumName'
    },
    mascot: {
      type: 'string',
      columnName: 'teamMascot'
    },
    followers: {
      type: 'integer',
      columnName: 'teamFollowers'
    },
    stadiums: {
      collection: 'Stadium',
      through: 'venue',
      via: 'team'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.mascot;
      return obj;
    }
  }

};
