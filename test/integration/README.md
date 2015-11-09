Integration tests
==========================
[![Build Status](https://travis-ci.org/balderdashy/offshore-adapter-tests.svg?branch=master)](https://travis-ci.org/balderdashy/offshore-adapter-tests)

A set of integration tests that test the official adapters against offshore core edge version: [example](https://travis-ci.org/balderdashy/offshore-adapter-tests/jobs/56168135#L1326).


## Goals

 * Detect if a change in offshore core breaks the API;
 * Detect if a change in offshore-adapter-tests breaks any official adapter tests;
 * Test using the edge versions of offshore core, offshore-adapter-tests and the adapters to ensure the current snapshot of all these are working together and consequently are OK to release;
 * make it easier for offshore core developers to test changes against all official adapters (it's not fun to setup all these dbs and run tests 6 times).


## What's the difference between these tests and the ones ran by the individual adapters?

The adapters are configured to run their tests against the **stable** versions of offshore core and offshore-adapter-tests. From an adapter point of view, this makes sense since the adapter is only responsible for supporting the stable versions of its dependencies. These tests run against offshore core **edge** version (latest in github) and the objective is to prevent changes in offshore core to accidently break the adapters.


## Why not have these tests ran in offshore core builds?

These tests will likely break more often as they are dependent on the adapters themselves so there is a risk for false positives and we don't want to add noise to the offshore core builds. Still, a subset of these adapter tests has been added to offshore ([PR #896](https://github.com/balderdashy/offshore/pull/896)). It only tests offshore core against sails-memory and it constitutes a *canary test* to detect API breaks.


For more details check the following PRs: [#36](https://github.com/balderdashy/offshore-adapter-tests/pull/36), [#39](https://github.com/balderdashy/offshore-adapter-tests/pull/39).
