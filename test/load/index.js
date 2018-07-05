var exec = require('child_process').exec;
var asynk = require('asynk');

var adapters = ['offshore-sql', 'offshore-memory'];
if (process.argv.length > 2) {
  adapters = process.argv.splice(2);
}
console.log('About to test ' + adapters + ' ...');

console.time('total time elapsed');

asynk.each(adapters, function(adapterName, next){
  console.log("\n");
  console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
  console.log("\033[0;34m                                     %s \033[0m", adapterName);
  console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
  console.log();
  
  var child = exec('node ./test/load/runner.js ' + adapterName);
  child.stdout.on('data', function(data){
    process.stdout.write(data);
  });
  child.stderr.on('data', function(data){
    process.stdout.write(data);
  });
  child.on('close', function(code) {
    console.log('closing code: ' + code);
    next();
  });
  
}).serie().asCallback(function allDone(err, results){
  console.timeEnd('total time elapsed');
});
