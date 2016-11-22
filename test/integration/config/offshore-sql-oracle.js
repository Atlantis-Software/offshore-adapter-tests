var package = require('../../../node_modules/offshore-sql/package.json');
module.exports = {
  name: 'offshore-sql (Oracle)',
  adapter: require('../../../node_modules/offshore-sql'),
  interfaces: package['offshoreAdapter'].interfaces,
  features: package['offshoreAdapter'].features || [],
  config: {
    host: 'localhost/XE',
    port: 1521,
    user: 'travis',
    password: 'travis',
    database: 'offshoreora',
    dbType: 'oracle',
    stmtCacheSize: 0
  }
};
