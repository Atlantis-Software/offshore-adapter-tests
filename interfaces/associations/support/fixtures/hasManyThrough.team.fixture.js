module.exports = {

  tableName: 'teamTable',
  identity: 'team',

  attributes: {
    name: {
      type: 'string'
    },
    mascot: {
      type: 'string'
    },
    followers: {
      type: 'integer'
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
