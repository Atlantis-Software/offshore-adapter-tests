/**
 * Test runner dependencies
 */
var util = require('util');
var mocha = require('mocha');

var adapterName = process.env.ADAPTER_NAME || process.argv[2];
var TestRunner = require('../../lib');
var settings = {};
try {
  settings = require('./config/' + adapterName);
} catch(e){
  console.warn("Warning: couldn't find config file for " + adapterName + ".");
}
var Adapter = settings.adapter;


console.info('Testing `' + settings.name + '`, a Offshore adapter.');
console.info('Running `offshore-adapter-tests` against ' + settings.interfaces.length + ' interfaces...');
console.info('( ' + settings.interfaces.join(', ') + ' )');
if (settings.features.length) {
  console.info('and against ' + settings.features.length + ' feature tests...');
  console.info('( ' + settings.features.join(', ') + ' )');
}
console.log();
console.log('Latest draft of Offshore adapter interface spec:');
console.log();


/**
 * Integration Test Runner
 *
 * Uses the `offshore-adapter-tests` module to
 * run mocha tests against the specified interfaces
 * of the currently-implemented Offshore adapter API.
 */
new TestRunner({

  // Load the adapter module.
  adapter: Adapter,

  // Default adapter config to use.
  config: settings.config,

  // The set of adapter interfaces to test against.
  // (grabbed these from this adapter's package.json file above)
  interfaces: settings.interfaces,

  // The set of adapter features to test against.
  // (grabbed these from this adapter's package.json file above)
  features: settings.features,

  // Mocha options
  // reference: https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
  mocha: {
    reporter: 'spec'
  },

  mochaChainableMethods: {},

  // Return code != 0 if any test failed
  failOnError: true

  // Most databases implement 'semantic' and 'queryable'.
  //
  // As of Offshore, the 'associations' interface
  // is also available.  If you don't implement 'associations',
  // it will be polyfilled for you by Offshore core.  The core
  // implementation will always be used for cross-adapter / cross-connection
  // joins.
  //
  // In future versions of Offshore, 'queryable' may be also
  // be polyfilled by core.
  //
  // These polyfilled implementations can usually be further optimized at the
  // adapter level, since most databases provide optimizations for internal
  // operations.
  //
  // Full interface reference:
  // https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md
});
