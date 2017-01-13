module.exports.user_resource = {

  tableName: 'user_resourceTable',
  identity: 'user_resource',

  attributes: {
    name: {
      type: 'string'
    },
    quantity: {
      type: 'integer'
    },
    profile: {
      model: 'profile'
    },


    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }


};

module.exports.profile = {

  tableName: 'profileTable',
  identity: 'profile',

  attributes: {
    name: {
      type: 'string'
    },
    level : {
      type: 'integer'
    },
    user: {
      model: 'user_resource'
    },


    toJSON: function() {
      var obj = this.toObject();
      delete obj.level;
      return obj;
    }
  }

};
