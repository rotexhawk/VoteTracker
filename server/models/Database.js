import { mysqlConnection as mysql } from '../connections';

export default class Database {
    constructor(table) {
        this.table = table;
        this.mysql = mysql;
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.mysql.getConnection((err, conn) => {
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
            this.mysql.end(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    async tableExists() {
        const sql = 'SHOW TABLES LIKE ?';
        var dbResults = await this.query(sql, [this.table]);
        return dbResults.length > 0;
    }
    escape(sql) {
        return this.mysql.escape(sql);
    }

    format(str, args) {
        return new Promise((resolve, reject) => {
            this.mysql.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn.format(str, args));
            });
        });
    }
}
