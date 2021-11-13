const dbFunctions = require('../core/db_functions');

module.exports = function (app) {
    app.get('/v1/categories/all', (_, res) => {
        dbFunctions.getAll(res, 'categories');
    });
}