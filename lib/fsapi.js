/**
 * Bunch of filesystem plus shell utilities
 */

var async = require('async'),

    fs = require('fs');

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
    }
};
