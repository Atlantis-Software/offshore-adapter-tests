module.exports = {

  // tableName: 'customTable',
  identity: 'custom',
  connection: 'migratable',
  migrate: 'alter',

  attributes: {
    name: {
    	type: 'string'
    },
    age: {
      type: 'integer'
    }
  }

};
