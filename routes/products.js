'use strict'

const dbFuncs = require('../core/db_functions');
const schemas = require('../schemas/products.js')
const coreSchemas = require('../schemas/core');

module.exports = function (app, db) {
    app.get('/v1/products/all', (_, res) => {
        dbFuncs.getAll(db, 'products').then(result => {
            if (result.error) {
                res.status(500).send(result);
            } else {
                res.status(200).send(result);
            }
        });
    });

    app.put('/v1/products/new', (req, res) => {
        const body = req.body;
        var result = schemas.new.validate(body);

        const sql = 'INSERT INTO products (name, expiry, in_date, count, category) VALUES (?, ?, ?, ?, ?)';
        const params = [body.name, body.expiry, body.inDate, body.count, body.category];

        if (result.error) {
            res.status(500).send(result.error);
        } else {
            dbFuncs.add(db, sql, params).then(result => {
                if (result.error) {
                    res.status(500).send(result);
                } else {
                    res.status(200).send(result);
                }
            });
        }
    });

    app.delete('/v1/products/:id', (req, res) => {
        const id = req.params.id;
        var result = coreSchemas.id.validate(id);

        const sql = 'DELETE FROM products WHERE id = (?)';
        const params = [id];

        if (result.error) {
            res.status(400).send({ "error": result.error });
        } else {
            dbFuncs.checkExists(db, 'products', id).then(result => {
                if (!result.error) {
                    db.run(sql, params, (err) => {
                        dbFuncs.removeCheck(err).then(result => {
                            if (result.error) {
                                res.status(500).send(result);
                            } else {
                                res.status(200).send(result);
                            }
                        });
                    });
                } else {
                    res.status(500).send(result);
                }
            });
        }
    });

    // TODO: finish implementing
    app.put('/v1/products/update/count', (req, res) => {
        const id = req.body.id;
        var result1 = coreSchemas.id.validate(id);

        const count = req.body.count;
        var result2 = schemas.count.validate(count);

        const sql = 'UPDATE products SET count = (?) WHERE id = (?)';
        const params = [count, id];

        if (result1.error || result2.error) {
            res.status(400).send({ "error": result1.error || result2.error });
        } else {
            res.status(200).send({});
        }
    });
}