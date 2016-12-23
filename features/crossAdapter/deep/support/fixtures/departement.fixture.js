module.exports = {
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
    seller: {
      model: 'Seller',
      columnName: 'departmentSeller'
    }
  }
};
