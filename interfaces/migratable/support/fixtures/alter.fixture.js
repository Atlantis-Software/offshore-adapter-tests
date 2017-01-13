module.exports = {

  tableName: 'alter',
  connection: 'migratable',
  migrate: 'alter',

  attributes: {
    name: 'string',
    age: 'integer'
  }

};
