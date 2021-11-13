'use strict'

const dbFuncs = require('../core/db_functions');
const schemas = require('../schemas/categories.js')
const coreSchema = require('../schemas/core');

module.exports = function (app, db) {
    app.get('/v1/categories/all', (_, res) => {
        dbFuncs.getAll(db, res, 'categories');
    });

    app.put('/v1/categories/new', (req, res) => {
        const body = req.body;
        var result = schemas.new.validate(body);

        const sql = 'INSERT INTO categories (name, default_date) VALUES (?, ?)';
        const params = [body.name, body.defaultDate];

        if (result.error) {
            res.status(500).send(result.error);
        } else {
            dbFuncs.add(db, res, sql, params);
        }
    });

    app.delete('/v1/categories/:id', (req, res) => {
        const id = req.params.id;
        var result = coreSchema.id.validate(id);

        const sql = 'DELETE FROM categories WHERE id = (?)';
        const params = [id];

        if (result.error) {
            res.status(200).send({ "error": result.error });
        } else {
            dbFuncs.checkExists(db, res, 'categories', id).then((exists) => {
                if (exists) {
                    db.run(sql, params, (err) => {
                        dbFuncs.removeCheck(db, res, err);
                    });
                }
            });
        }
    });
}