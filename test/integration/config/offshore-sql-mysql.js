var package = require('../../../node_modules/offshore-sql/package.json');
module.exports = {
  name: 'offshore-sql (Mysql)',
  adapter: require('../../../node_modules/offshore-sql'),
  interfaces: package['offshoreAdapter'].interfaces,
  features: package['offshoreAdapter'].features || [],
  config: {
    host: process.env.MYSQL_PORT_3306_TCP_ADDR || 'localhost',
    port: 3306,
    user: process.env.MYSQL_ENV_MYSQL_USER || 'root',
    password: process.env.MYSQL_ENV_MYSQL_PASSWORD || '',
    database: process.env.MYSQL_ENV_MYSQL_DATABASE || 'offshoresql',
    dbType: 'mysql'
  }
};
