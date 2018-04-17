Offshore Adapter Tests
==========================

A set of integration tests that can be included in your Offshore Adapter module and used to test
your adapter against the current Offshore API.

[![npm version](https://badge.fury.io/js/offshore-adapter-tests.svg)](https://www.npmjs.com/offshore-adapter-tests)
[![Build Status](https://travis-ci.org/Atlantis-Software/offshore-adapter-tests.svg?branch=master)](https://travis-ci.org/Atlantis-Software/offshore-adapter-tests)
[![Coverage Status](https://coveralls.io/repos/github/Atlantis-Software/offshore-adapter-tests/badge.svg?branch=master)](https://coveralls.io/github/Atlantis-Software/offshore-adapter-tests?branch=master)
[![NSP Status](https://nodesecurity.io/orgs/atlantis/projects/30ec60e6-5fe3-4546-9d4d-52be60ef5fa3/badge)](https://nodesecurity.io/orgs/atlantis/projects/30ec60e6-5fe3-4546-9d4d-52be60ef5fa3)
[![Dependencies Status](https://david-dm.org/Atlantis-Software/offshore-adapter-tests.svg)](https://david-dm.org/Atlantis-Software/offshore-adapter-tests)

## Adapter Interface Specification


## Usage

#### Write a test runner

> i.e. `runner.js`

```javascript
/**
 * Test runner dependencies
 */
var mocha = require('mocha');
var TestRunner = require('offshore-adapter-tests');


/**
 * Integration Test Runner
 *
 * Uses the `offshore-adapter-tests` module to
 * run mocha tests against the specified interfaces
 * of the currently-implemented Offshore adapter API.
 */
new TestRunner({

	// Load the adapter module.
	adapter: require('./relative/path/to/your/adapter'),

	// Default adapter config to use.
	config: {
		schema: false
	},

	// The set of adapter interfaces to test against.
	interfaces: ['semantic', 'queryable']
});
```

#### Run the tests

```sh
$ node runner.js
```


## Running Tests in a Vagrant VM

Since it is not necessarily desirable to install all the databases on the local host 
where this package is tested a [Vagrant](https://www.vagrantup.com) configuration for 
a fully configured virtual host is provided. To run the tests using this virtual host
follow [these steps](.puppet/README.md). 

Using Vagrant is entirely optional. If you prefer to just run the test on your host
directly just ensure the various databases being tested are installed.


## MIT License

See LICENSE.md.
