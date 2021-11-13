'use strict'

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./freezer.db');
const app = express();

app.use(express.json());

app.get('/v1/test', (_, res) => {
    res.status(200).send({
        message: "success"
    });
});

require('./routes/categories')(app, db);
require('./routes/products')(app, db);

app.listen(3000, '0.0.0.0', () => {
    console.log("started server on http://localhost:3000/");

    db.serialize(() => {
        db.get("PRAGMA foreign_keys = ON");
        console.log('Database Serialized');
    });
});