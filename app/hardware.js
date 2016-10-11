// app/index.js
const os = require('os');

console.log('******* Hardware Stats *******');
console.log('Hostname = ' + os.hostname());
console.log('Operating system = ' + os.type() + ' ' + os.release() + ' ' + os.platform() + ' ' + os.arch());
console.log('CPU\'s');
var cpuInfo = os.cpus();
for(var i=0; i < cpuInfo.length; i++) {
  var cpuInst = cpuInfo[i];
  console.log(cpuInst.model);
}
console.log('Free Memory = ' + os.freemem());
console.log('******* Hardware Stats *******');
