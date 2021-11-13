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

    run: (db, sql, params) => {
        return new Promise(resolve => {
            db.run(sql, params, (err) => {
                if (err === null) {
                    resolve({ message: "success" });
                } else {
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

    checkExists: (db, table, id) => {
        return new Promise(resolve => {
            db.get(`SELECT COUNT(*) FROM ${table} WHERE id = ${id}`, (err, row) => {
                if (err) {
                    resolve({ error: err.message });
                } else if (row['COUNT(*)'] === 0) {
                    resolve({ exists: false });
                } else {
                    resolve({ message: "success" });
                }
            });
        });
    },
};