var child_process = require('child_process');
var asynk = require('asynk');
var npm = require('npm');
var jpath = require('jpath');
var fs = require('fs');


/////////////////////////////////////////////////////////////////////
//
// Config

// The adapters being tested
var adapters = [];
fs.readdirSync(__dirname + '/config').forEach(function(adapter) {
  var config = require('./config/' + adapter);
  config.fileName = adapter.slice(0, -3);
  adapters.push(config);
});

// Core modules npm Dependencies path
var coreModulesPaths = {
  "offshore":               ".dependencies.offshore",
  "- offshore-validator":   ".dependencies.offshore.dependencies.offshore-validator",
  "- offshore-schema":      ".dependencies.offshore.dependencies.offshore-schema",
  "offshore-adapter-tests": "."
};


//
/////////////////////////////////////////////////////////////////////


var status = {};
var npmData;
var exitCode = 0;
process.env.FORCE_COLORS = true;

console.time('total time elapsed');

var resultTable = "\n";
resultTable += " ------------------------------------------------------------------------------------- \n";
resultTable += "| adapter                    | version | result | failed | total |        time        |\n";
resultTable += "|----------------------------|---------|--------|--------|-------|--------------------|\n";

function getNpmDetails(cb){
  npm.load({ depth: 2 }, function (er) {
    if (er) return process.exit(1);

    npm.commands.ls('', true, function(err, data){
      npmData = data;
      cb(err, data);
    });
  });
}

function runTests(cb){
  asynk.each(adapters, function(adapter, next){
    var adapterName = adapter.name;
    var settings = adapter.config;
    status[adapterName] = { passed: 0, failed: 0, total: 0, exitCode: 0, startTime: new Date().getTime() };

    console.log("\n");
    console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
    console.log("\033[0;34m                                     %s \033[0m", adapterName);
    console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
    console.log();

    var child = child_process.fork('./test/integration/runner.js', [adapter.fileName], { env: process.env });

    child.on('message', function(msg) {
      status[adapterName].total++;
      if (msg.state === 'passed') {
        status[adapterName].passed++;
      } else {
        status[adapterName].failed++;
      }
    });

    child.on('close', function(code) {
      status[adapterName].exitCode = code;
      var message = code == 0 ? "\033[0;32mpassed\033[0m" : "\033[0;31mfailed\033[0m";
      resultTable += "| " + padRight(adapterName, 26)
        + " | " + padLeft(processVersion(npmData.dependencies[adapterName]), 7)
        + " | " + message
        + " | " + padLeft(status[adapterName].failed, 6)
        + " | " + padLeft(status[adapterName].total, 5)
        + " | " + padLeft((new Date().getTime() - status[adapterName].startTime) + ' ms', 18)
        + " |\n";

      console.log('exit code: ' + code);
      if(code != 0 && (!settings || !settings.returnZeroOnError)) { exitCode = exitCode + code; }
      next();
    });
  }).serie().asCallback(cb);
}

function printCoreModulesVersions(cb){
  var coreModules = "\n";
  coreModules += " ----------------------------------- \n";
  coreModules += "| core modules            | version |\n";
  coreModules += "|-------------------------|---------|\n";
  for(var moduleName in coreModulesPaths){
    coreModules += getModuleRow(moduleName, jpath(npmData, coreModulesPaths[moduleName])[0]);
  }
  coreModules += " ----------------------------------- \n";
  console.log(coreModules);
  cb();
}

function getModuleRow(name, module){;
  return "| "+ padRight(name, 23) + " | "
    + padLeft(processVersion(module), 7)
    + " |\n";
}

asynk.add(getNpmDetails).add(runTests).add(printCoreModulesVersions).serie().asCallback(function(err, res){
  resultTable += " ------------------------------------------------------------------------------------- \n";
  console.log(resultTable);
  console.timeEnd('total time elapsed');
  if(err){
    console.error('Something wrong happened:', err);
  }
  process.exit(exitCode);
});

/**
 * Aux functions
 */

function padRight(str, padding){
  var res = "" + str;
  for(var i=res.length; i<padding; i++){
    res += ' ';
  }
  return res;
}

function padLeft(str, padding){
  str = str + "";
  var pad = "";
  for(var i=str.length; i<padding; i++){
    pad += ' ';
  }
  return pad + str;
};

function processVersion(dependency){
  if(!dependency) return '';
  if(dependency._resolved){
    if(dependency._resolved.indexOf('git') === 0){
      var parts = dependency._resolved.split('#');
      return parts[parts.length-1].slice(0, 7);
    }
    if(dependency._resolved.indexOf('npmjs.org') >= 0){
      return dependency.version;
    }
  }
  if(dependency.gitHead){
    return dependency.gitHead.slice(0, 7);
  }
  // console.warn('WARN: Not sure we found the dependency that was resolved.');
  return dependency.version;
}
