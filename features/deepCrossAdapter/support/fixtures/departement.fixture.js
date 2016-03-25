/**
 * Dependencies
 */

var Offshore = require('offshore');

module.exports = Offshore.Collection.extend({
  identity: 'Department',
  connection: 'deep2',
  tableName: 'department_table',
  attributes: {
    id: {
      columnName: 'departmentId',
      type: 'integer',
      primaryKey: true
    },
    name: {
      columnName: 'departmentName',
      type: 'string'
    },
    constructor: {
      model: 'Constructor'
    }
  }
});
