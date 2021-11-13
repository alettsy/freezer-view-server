'use strict'

module.exports = {
    getAll: (db, name) => {
        return new Promise(resolve => {
            db.all(`SELECT * FROM ${name};`, [], (err, rows) => {
                if (err) {
                    resolve({ error: err.message });
                } else {
                    resolve(rows);
                }
            });
        });
    },

    add: (db, sql, params) => {
        return new Promise(resolve => {
            db.run(sql, params, (err) => {
                if (err === null) {
                    // res.status(200).send({
                    //     message: "success",
                    // });
                    resolve({ message: "success" });
                } else {
                    //res.status(500).send({ error: err.message });
                    resolve({ error: err.message });
                }
            });
        });
    },

    removeCheck: (err) => {
        return new Promise(resolve => {
            if (err === null) {
                resolve({ message: "success" });
            } else {
                resolve({ error: err.message });
            }
        })
    },

    checkExists: async (db, table, id) => {
        return new Promise(resolve => {
            db.get(`SELECT COUNT(*) FROM ${table} WHERE id = ${id}`, (err, row) => {
                if (err) {
                    resolve({ error: err.message });
                } else if (row['COUNT(*)'] === 0) {
                    resolve({ error: "does not exist" });
                } else {
                    resolve({ message: "success" });
                }
            });
        });
    }
};