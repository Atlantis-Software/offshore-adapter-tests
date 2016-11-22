var package = require('../../../node_modules/offshore-sql/package.json');
var _ = require('lodash');
var features = _.filter(package['offshoreAdapter'].features || [], function(feature) {
  return feature !== 'autoIncrement.sequential';
});
module.exports = {
  name: 'offshore-sql (Oracle)',
  adapter: require('../../../node_modules/offshore-sql'),
  interfaces: package['offshoreAdapter'].interfaces,
  features: features,
  config: {
    host: 'localhost',
    port: 1521,
    user: 'travis',
    password: 'travis',
    database: 'xe',
    dbType: 'oracle',
    stmtCacheSize: 0
  }
};
