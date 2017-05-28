var path = require('path');

module.exports = {
    problem: {
        valid: {
            path: '/contest/810/problem/A',
            response: path.join(__dirname, 'responses', '810A.html'),
            statusCode: 200
        },

        invalid: {
            path: '/contest/810/problem/F',
            response: path.join(__dirname, 'responses', '810F.html'),
            statusCode: 200
        },

        nonok: {
            path: '/contest/810/problem/L',
            statusCode: 500,
            response: path.join(__dirname, 'responses', '810L.html')
        }
    }
};
