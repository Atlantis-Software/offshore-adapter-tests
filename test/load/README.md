Load tests
==========
A script that measures the memory comsumption of offshore under load, using the official adapters.

## Goal
Provide a tool to reliably measure performance of offshore and its adapters. Before pushing any changes 
upstream it's a good idea to check if the performance has not deteriorated.  

## Usage

### Run against all official adapters
``` shell
npm run test-load
```

### Run against chosen adapters
Example:
``` shell
npm run test-load -- sails-memory sails-disk
```
