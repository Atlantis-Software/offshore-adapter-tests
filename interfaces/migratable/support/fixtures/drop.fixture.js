module.exports = {

  tableName: 'drop',
  connection: 'migratable',
  migrate: 'drop',

  attributes: {
    name: 'string',
    age: 'integer'
  }

};
