var package = require('../../../node_modules/offshore-sql/package.json');
var features = package['offshoreAdapter'].features;

// Disable sequential auto-increment tests, because postgre does not behave like MySql in this case
// it does not leave gap in IDs
if(features.indexOf('autoIncrement.sequential') !== -1) {
  features.splice(features.indexOf('autoIncrement.sequential'), 1);
}

module.exports = {
  name: 'offshore-sql (PostgreSql)',
  adapter: require('../../../node_modules/offshore-sql'),
  interfaces: package['offshoreAdapter'].interfaces || [],
  features: package['offshoreAdapter'].features || [],
  config: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'offshorepg',
    dbType: 'postgres'
  }
};
