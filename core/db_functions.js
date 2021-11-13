module.exports = function (db) {
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
}