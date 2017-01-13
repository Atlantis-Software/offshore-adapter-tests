module.exports.user_resource = {

  tableName: 'user_resourceCustomTable',
  identity: 'user_resourceCustom',

  autoPk: false,

  attributes: {
    number: {
      type: 'integer',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    quantity: {
      type: 'integer'
    },
    profile: {
      model: 'profileCustom'
    }
  }

};

module.exports.profile = {

  tableName: 'profileCustomTable',
  identity: 'profileCustom',
  connection: 'associations',

  autoPk: false,

  attributes: {
    name: {
      type: 'string',
      primaryKey: true
    },
    level : {
      type: 'integer'
    },
    user: {
      model: 'user_resourceCustom'
    }
  }

};
