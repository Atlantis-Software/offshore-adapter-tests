module.exports = {

  tableName: 'create',
  connection: 'migratable',
  migrate: 'create',

  attributes: {
    name: 'string',
    age: 'integer'
  }

};
