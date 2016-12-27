module.exports = {

  identity: 'DepartmentDeep',
  tableName: 'departmentDeepTable',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    seller: {
      model: 'SellerDeep'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
};
