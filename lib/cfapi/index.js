/**
 *  cfapi that extracts round information
 */
var _ = require('lodash'),
    async = require('async'),
    request = require('request'),
    cheerio = require('cheerio');

module.exports = {

    /**
     * _getProblem - gets html from codeforces round page given url
     *
     * @param  {Object} options options for codeforces
     * @param  {Function} cb      The callback that marks the end of _getProblem function
     * @return {*}
     */
    _getProblem: function(options, cb) {
        var self = this;

        if (!options.url) {
            return cb(new Error('Problem Url is required'));
        }

        async.waterfall([
            // 1. Get problem statement
            async.apply(request.get, options.url),

            // 2. Parse I/O
            function(res, html, cb) {
                if (res.statusCode !== 200) {
                    return cb(new Error('Received non 200 from codeforces'));
                }
                return self._getProblemIO(html, cb);
            }
        ], function(err, problemIO) {
            if (err) { return cb(err); }

            return cb(null, problemIO);
        });
    },

    /**
     * _processPreTags - A helper method that parses pretags children and removes linebreaks
     * <pre> 5, 6, 7 </br> </pre> <pre> 7, 8, 9 </br> </pre> => [[5, 6, 7], [7, 8, 9]]
     * @param  {Collection} preTags Object or Array of preTags to parse
     * @return {Array} processedPreTags
     */
    _processPreTags: function(preTags) {
        return _.map(preTags, function(input) {
            return _.transform(input.children, function(result, child) {
                !_.isEmpty(child.data) && (result.push(child.data));
            }, []);
        });
    },


    /**
     * _getProblemIO - Helper method that extracts input and output from raw cf problem html
     *
     * @param  {string} html A html page of cf problem
     * @param  {Function} cb   A callback that marks the end of the getProblemIO function
     * @return {*}
     */
    _getProblemIO: function(html, cb) {
        var $ = cheerio.load(html),
            problemIO = {};

        _.assign(problemIO, {
            inputs: this._processPreTags($('.problem-statement .input pre')),
            outputs: this._processPreTags($('.problem-statement .output pre'))
        });

        return cb(null, problemIO);
    }
};
