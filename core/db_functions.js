'use strict'

module.exports = {
    getAll: (db, res, name) => {
        db.all(`SELECT * FROM ${name};`, [], (err, rows) => {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                res.status(200).send(rows);
            }
        });
    },

    add: (db, res, sql, params) => {
        db.run(sql, params, (err) => {
            if (err === null) {
                res.status(200).send({
                    message: "success",
                });
            } else {
                res.status(500).send({ error: err.message });
            }
        });
    },

    removeCheck: (db, res, err) => {
        if (err === null) {
            res.status(200).send({ message: "success" });
        } else {
            res.status(500).send({ error: err.message });
        }
    },

    checkExists: async (db, res, table, id) => {
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
};