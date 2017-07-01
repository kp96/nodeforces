/**
 * Compiler api that compiles and executes (cpp|java) code
 */

var _ = require('lodash'),
    async = require('async'),

    fs = require('fs'),
    path = require('path'),
    child_process = require('child_process');

module.exports = {
    _compile: function(dir, file, options, cb) {
        var self = this,
            compiler;

        if (_.isFunction(options)) {
            cb = options;
            options = [];
        }

        options.push(file);

        compiler = child_process.spawn(self._getCompilerName(file), options, {
            cwd: dir
        });

        compiler.stderr.on('data', function(data) {
            console.error(`${data}`);
        });

        compiler.on('close', function(code) {
            return cb(code === 0 ? null : new Error('Compilation Failed'));
        });
    },

    _run: function(args, inFile, cb) {
        var dir = args.dir,
            srcFile = args.fileName,
            isWin = (/^win/).test(process.platform),
            splits = _.split(srcFile, '.'),
            isCpp = splits[1] === 'cpp',
            runTime = isCpp ? (isWin ? 'a.exe' : './a.out') : 'java',
            isTimedOut = false, // hacky workaround
            runner,
            timeout;

        runner = child_process.spawn(runTime, [!isCpp && ('Main')], {
            cwd: dir,
            stdio: [
                // stdin
                fs.openSync(inFile, 'r'),

                // stdout
                fs.openSync(path.join(dir, path.basename(inFile).replace('in', 'tout')), 'w'),

                // stderr
                'pipe'
            ]
        }, cb);

        timeout = setTimeout(function() {
            isTimedOut = true;
            runner.kill();
        }, args.timeout || 5000);

        runner.stderr.on('data', function(data) {
            console.error(`${data}`);
        });

        runner.on('close', function(code) {
            if (!isTimedOut) {
                clearTimeout(timeout);
            }
            return cb(code === 0 ? null : new Error(`Run Failed. Exit Code ${code || 1}`));
        });
    },

    _getCompilerName: function(srcFile) {
        return _.split(srcFile, '.')[1] === 'cpp' ? 'g++' : 'javac';
    },

    exec: function(args, inputs, cb) {
        var self = this;

        async.waterfall([
            // 1. Try to compile with config options
            function(cb) {
                return self._compile(args.dir, args.fileName, args.options, cb);
            },

            // 3. Run the compiled code with sample test cases
            function(cb) {
                return async.map(inputs, function(input, cb) {
                    return self._run(args, input, cb);
                }, cb);
            }
        ], cb);
    }
};
