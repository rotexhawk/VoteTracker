import { pool, mysql } from '../connections';

export default class Database {
    constructor(table) {
        this.table = table;
        this.pool = pool;
        this.mysql = mysql;
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) throw err;
                conn.query(sql, args, (err, rows) => {
                    if (err) return reject(err);
                    conn.release();
                    resolve(rows);
                });
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    escape(sql) {
        return this.pool.getConnection((err, conn) => {
            if (err) throw error;
            return conn.format(sql);
        });
    }

    format(sql, args) {
        return this.mysql.format(sql, args);
    }
}
