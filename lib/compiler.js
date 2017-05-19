/**
 * Compiler api that compiles and executes (cpp|java) code
 */

var _ = require('lodash'),
    async = require('async'),

    fs = require('fs'),
    path = require('path'),
    child_process = require('child_process'),

    config = require('./config');

module.exports = {
    _compile: function(dir, file, options, cb) {
        var self = this,
            compiler;

        if (_.isFunction(options)) {
            cb = options;
            options = [];
        }

        options.push(file);

        compiler = child_process.spawn(self._getCompilerName(file), options, { cwd: dir });

        compiler.stderr.on('data', function(data) {
            console.error(`${data}`);
        });

        compiler.on('close', function(code) {
            return cb(code === 0 ? null : new Error('Compilation failed'));
        });
    },

    _run: function(dir, srcFile, inFile, cb) {
        var isWin = (/^win/).test(process.platform),
            isCpp = _.split(srcFile, '.')[1] === 'cpp',
            runTime = isCpp ? (isWin ? 'a.exe' : './a.out') : 'java',
            runner;

        // console.log(path.join(dir, inFile));
        // fs.open(path.join(dir, inFile), function(err) { console.log(err);});

        runner = child_process.spawn(runTime, [!isCpp && (_.split(srcFile, '.')[0])], {
            cwd: dir,
            stdio: [
                // stdin
                fs.openSync(path.join(dir, inFile), 'r'),

                // stdout
                fs.openSync(path.join(dir, inFile.replace('in', 'tout')), 'w'),

                // stderr
                'pipe'
            ]
        });

        runner.stderr.on('data', function(data) {
            console.error(`${data}`);
        });

        runner.on('close', function(code) {
            return cb(code === 0 ? null : new Error('Run Failed'));
        });
    },

    _getCompilerName: function(srcFile) {
        return _.split(srcFile, '.')[1] === 'cpp' ? 'g++' : 'javac';
    },

    exec: function(dir, srcFile, inputs, cb) {
        var self = this;

        async.waterfall([
            // 1. Get the config options for compiler options
            async.apply(config.get),

            // 2. Try to compile with config options
            function(config, cb) {
                var options = _.get(config, 'compiler.options', []);

                return self._compile(dir, srcFile, options, cb);
            },

            // 3. Run the compiled code with sample test cases
            function(cb) {
                return async.map(inputs, function(input, cb) {
                    return self._run(dir, srcFile, input, cb);
                }, cb);
            }
        ], cb);
    }
};
