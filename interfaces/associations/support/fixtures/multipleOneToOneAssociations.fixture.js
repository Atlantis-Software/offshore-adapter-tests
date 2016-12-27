module.exports.user_resource = {

  tableName: 'user_resourceManyTable',
  identity: 'user_resourceMany',

  attributes: {
    name: {
      type: 'string'
    },
    quantity: {
      type: 'integer'
    },
    profile: {
      model: 'profileMany'
    },
    profilePvp: {
      model: 'profileMany'
    }
  }

};

module.exports.profile = {

  tableName: 'profileManyTable',
  identity: 'profileMany',

  attributes: {
    name: {
      type: 'string'
    },
    level : {
      type: 'integer'
    },
    user: {
      model: 'user_resourceMany'
    }
  }

};
