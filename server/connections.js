import config from './config/db.json';
import mysql from 'mysql';

const pool = mysql.createPool(config.mysql);

export { pool, mysql };
