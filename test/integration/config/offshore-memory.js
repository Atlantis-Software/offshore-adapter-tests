var package = require('../../../node_modules/offshore-memory/package.json');
module.exports = {
  name: 'offshore-memory',
  adapter: require('../../../node_modules/offshore-memory'),
  interfaces: package['offshoreAdapter'].interfaces,
  features: package['offshoreAdapter'].features || [],
  schema: false
};
