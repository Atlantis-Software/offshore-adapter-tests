module.exports = {

  tableName: 'safe',
  connection: 'migratable',
  migrate: 'safe',

  attributes: {
    name: 'string',
    age: 'integer'
  }

};
