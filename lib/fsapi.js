/**
 * Bunch of filesystem plus shell utilities
 */

var _ = require('lodash'),
    async = require('async'),

    fs = require('fs'),
    path = require('path');

module.exports = {
    readJSONFile: function(fileName, cb) {
        fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) { return cb({}); }

            var jsonData;

            try {
                jsonData = JSON.parse(data);
            }
            catch (e) {
                jsonData = {};
            }

            return cb(null, jsonData);
        });
    },

    createFileWithHeader: function(fileHeaderPath, filePath, cb) {
        async.waterfall([
            // 1. Try to read file header
            function(cb) {
                fs.readFile(fileHeaderPath, 'utf8', function(err, data) {
                    err && (data = '');

                    return cb(null, data);
                });
            },

            // 2. Create the File
            function(data, cb) {
                return fs.writeFile(filePath, data, cb);
            }
        ], function(err) {
            if (err) { return cb(err); }

            return cb();
        });
    },

    createIOFiles: function(dir, io, cb) {
        var self = this,
            files = self._parseIOFiles(io);

        async.map(files, function(file, cb) {
            return fs.writeFile(path.join(dir, file.name), file.data, cb);
        }, function(err) {
            if (err) { return cb(err); }

            return cb();
        });
    },

    _parseIOFiles: function(io) {
        return _.transform(io, function(result, vals, type) {
            for (var i = 0; i < vals.length; i++) {
                result.push({ name: type + i + '.txt', data: vals[i] });
            }
        }, []);
    },

    getLinesFromFile: function(fileName, cb) {
        fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) { return cb(null, []); }

            return cb(null, _.compact(_.split(data, '\n')));
        });
    },

    getOutputFiles: function(dir, cb) {
        fs.readdir(dir, function(err, files) {
            if (err) { return cb(err); }

            files.sort(); // unsorted may not work in windows

            var toutputFiles = _.transform(files, function(result, file) {
                    (/^toutput.*$/).test(file) && (result.push(path.join(dir, file)));
                }, []),

                outputFiles = _.transform(files, function(result, file) {
                    (/^output.*$/).test(file) && (result.push(path.join(dir, file)));
                }, []);

            return cb(null, _.zip(toutputFiles, outputFiles));
        });
    }
};
