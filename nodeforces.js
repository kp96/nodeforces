/**
 * Main api that exposes init and test functions
 */
var testapi = require('./lib/testapi');

// module.exports = {
//     init: function(args, cb) {
//         return cb();
//     },
//
//     test: function(args) {
//         var testRunner = testapi.getRunner(),
//             testInstance = testapi.getTestInstance(testRunner, 'simple test');
//
//         testapi.addTest(testInstance, 'first case', ['toutput0.txt', 'output0.txt']);
//         testapi.addTest(testInstance, 'first case', ['toutput1.txt', 'output1.txt']);
//
//         testapi.run(testRunner);
//     }
// };

testapi.runTests('765A', '/home/krishna/Documents/projects/test', function(err) {
    err && console.log(error);
});
