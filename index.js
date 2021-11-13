'use strict'

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./freezer.db');
const app = express();

const Joi = require('joi');

const idSchema = Joi.number().integer().min(1);

const categorySchema = Joi.object({
    name: Joi.string().min(1).required(),
    defaultDate: Joi.number().integer().min(1).required()
});

const productsSchema = Joi.object({
    name: Joi.string().min(1).required(),
    expiry: Joi.date().required(),
    inDate: Joi.date().required(),
    count: Joi.number().integer().min(1).required(),
    category: idSchema.required()
});

app.use(express.json());

// TODO: add updateCount for products -> PUT /v1/products/update/count
// TODO: add update for products -> PUT /v1/products/update

app.get('/v1/test', (_, res) => {
    res.status(200).send({
        message: "success"
    });
});

app.get('/v1/categories/all', (_, res) => {
    getAll(res, 'categories');
});

app.put('/v1/categories/new', (req, res) => {
    const body = req.body;
    var result = categorySchema.validate(body);

    const sql = 'INSERT INTO categories (name, default_date) VALUES (?, ?)';
    const params = [body.name, body.defaultDate];

    if (result.error) {
        res.status(500).send(result.error);
    } else {
        add(res, sql, params);
    }
});

app.delete('/v1/categories/:id', (req, res) => {
    const id = req.params.id;
    var result = idSchema.validate(id);

    const sql = 'DELETE FROM categories WHERE id = (?)';
    const params = [id];

    if (result.error) {
        res.status(200).send({ "error": result.error });
    } else {
        checkExists(res, 'categories', id).then((exists) => {
            if (exists) {
                db.run(sql, params, (err) => {
                    removeCheck(res, err);
                });
            }
        });
    }
});

app.get('/v1/products/all', (_, res) => {
    getAll(res, 'products');
});

app.put('/v1/products/new', (req, res) => {
    const body = req.body;
    var result = productsSchema.validate(body);

    const sql = 'INSERT INTO products (name, expiry, in_date, count, category) VALUES (?, ?, ?, ?, ?)';
    const params = [body.name, body.expiry, body.inDate, body.count, body.category];

    if (result.error) {
        res.status(500).send(result.error);
    } else {
        add(res, sql, params);
    }
});

app.delete('/v1/products/:id', (req, res) => {
    const id = req.params.id;
    var result = idSchema.validate(id);

    const sql = 'DELETE FROM products WHERE id = (?)';
    const params = [id];

    if (result.error) {
        res.status(200).send({ "error": result.error });
    } else {
        checkExists(res, 'products', id).then((exists) => {
            if (exists) {
                db.run(sql, params, (err) => {
                    removeCheck(res, err);
                });
            }
        });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log("started server on http://localhost:3000/");

    db.serialize(() => {
        console.log('Database Serialized');
    });
});

function getAll(res, name) {
    db.all(`SELECT * FROM ${name};`, [], (err, rows) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(200).send(rows);
        }
    });
}

function add(res, sql, params) {
    db.run(sql, params, (err) => {
        if (err === null) {
            res.status(200).send({
                message: "success",
            });
        } else {
            res.status(500).send({ error: err.message });
        }
    });
}

function removeCheck(res, err) {
    if (err === null) {
        res.status(200).send({ message: "success" });
    } else {
        res.status(500).send({ error: err.message });
    }
}

async function checkExists(res, table, id) {
    return new Promise(resolve => {
        db.get(`SELECT COUNT(*) FROM ${table} WHERE id = ${id}`, (err, row) => {
            if (err) {
                res.status(500).send({ error: err.message });
                resolve(false);
            } else if (row['COUNT(*)'] === 0) {
                res.status(500).send({ error: "does not exist" });
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}