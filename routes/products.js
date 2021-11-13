'use strict'

const dbFuncs = require('../core/db_functions');
const schemas = require('../schemas/products.js')
const coreSchema = require('../schemas/core');

module.exports = function (app, db) {
    app.get('/v1/products/all', (_, res) => {
        dbFuncs.getAll(db, res, 'products');
    });

    app.put('/v1/products/new', (req, res) => {
        const body = req.body;
        var result = schemas.new.validate(body);

        const sql = 'INSERT INTO products (name, expiry, in_date, count, category) VALUES (?, ?, ?, ?, ?)';
        const params = [body.name, body.expiry, body.inDate, body.count, body.category];

        if (result.error) {
            res.status(500).send(result.error);
        } else {
            dbFuncs.add(db, res, sql, params);
        }
    });

    app.delete('/v1/products/:id', (req, res) => {
        const id = req.params.id;
        var result = coreSchema.id.validate(id);

        const sql = 'DELETE FROM products WHERE id = (?)';
        const params = [id];

        if (result.error) {
            res.status(200).send({ "error": result.error });
        } else {
            dbFuncs.checkExists(db, res, 'products', id).then((exists) => {
                if (exists) {
                    db.run(sql, params, (err) => {
                        dbFuncs.removeCheck(db, res, err);
                    });
                }
            });
        }
    });
}