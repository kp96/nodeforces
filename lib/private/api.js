var async = require('async'),
    cfapi = require('../cfapi'),
    api = {};

const ATTEMPTS = 5,
    START = 250,
    END = 985;

module.exports = api;


function generateRandomNumber(start, end) {
    return Math.floor(Math.random() * end) + start;
}


function getOptions(problemAlphas) {
    var problemAlpha = problemAlphas[generateRandomNumber(0, 2)],
        contestNumber = generateRandomNumber(START, END);

    return {
        url: `http://codeforces.com/contest/${contestNumber}/problem/${problemAlpha}`
    };
}

function _getRandomProblem(problemAlphas, cb) {
    return cfapi.getProblem(getOptions(problemAlphas), cb);
}


api.getRandomProblem = function(difficulty, cb) {
    var problemAlphas;

    switch (difficulty) {
        case 'EASY':
            problemAlphas = ['A', 'B'];
            break;
        case 'MEDIUM':
            problemAlphas = ['C', 'D'];
            break;
        case 'DIFFICULT':
            problemAlphas = ['E', 'F'];
            break;
        default:
            return cb(new Error(`Invalid problem difficulty ${difficulty}`));
    }

    return async.retry(ATTEMPTS, _getRandomProblem.bind(null, problemAlphas), cb);
};
