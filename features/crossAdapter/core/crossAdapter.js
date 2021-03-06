/**
 * Multiple Connections tests re-use the Associations interface tests so we need to
 * run them in a separe Mocha runner.
 */

/**
 * Dependencies
 */

var Path = require('path');
var _ = require('lodash');
var utils = require('../../../lib/utils');
var mocha = require('mocha');
var memoryAdapter = require('offshore-memory');

/**
 * Test Runner
 *
 * @param {Object} options
 * @api public
 */

module.exports = CrossAdapter;


function CrossAdapter(options, cb) {

  this.adapter = options.adapter;
  this.config = options.config || {};
  // The associationTypes must match the folder names in interfaces/associations
  this.associationTypes = ['belongsTo', 'hasMany', 'manyToMany', 'manyToManyThrough', 'oneToOne'];

  // Attach config to adapter
  // this.adapter.config = this.config;
  global.Connections = {
    'test': this.config,
    'test2': { schema: false }
  };

  global.Connections.test.adapter = 'wl_tests';
  global.Connections.test2.adapter = 'wl_tests2';

  // Globalize Adapter
  global.Adapter = this.adapter;
  global.MemoryAdapter = memoryAdapter;

  // Build an array of files to test
  var filter = '\\.(' + ['js'].join('|') + ')$';

  var files = [];

  var bootstrapPath = Path.resolve(__dirname,'../support');
  files = files.concat(utils.fileLookup(bootstrapPath, filter, true));

  this.associationTypes.forEach(function(type) {
    var interfacePath = Path.resolve(__dirname,'../../../interfaces/associations/' + type);
    files = files.concat(utils.fileLookup(interfacePath, filter, true));
  });

  // Build a Mocha Runner
  var test = new mocha(_.merge({
    timeout: 6000
  }, options.mocha||{}));

  if (options.mochaChainableMethods){
    _.forEach(options.mochaChainableMethods, function(arg, method){
      test[method](arg);
    });
  }

  // Set Global Placeholders for Ontologies
  global.Associations = {};

  // Allow Adapter to be a global without warning about a leak
  test.globals([Adapter, MemoryAdapter, Associations]);
  test.files = files;


  console.info('\nTesting Cross Adapter interface...\n');

  console.time('time elapsed');
  var runner = test.run(function(err) {
    console.timeEnd('time elapsed');
    cb(err);
  });

  if (options.childProcess) {
    runner.on('pass', function (test) {
      process.send({
        file: test.file,
        title: test.title,
        state: test.state,
        duration: test.duration
      });
    });

    runner.on('fail', function (test, error) {
      console.error(test.err);
      process.send({
        file: test.file,
        title: test.title,
        state: test.state,
        duration: test.duration,
        err: test.err
      });
    });
  }
};

/**
 * Mocha keeps the test files cached through require, we need to clean them in order to not
 * repeat the tests
 * @param {Object} files
 */
CrossAdapter.cleanTestCache = function(files){
  files.forEach(function(val){
    delete require.cache[val];
  });
};
