import config from './config/db.json';
import mysql from 'mysql';

const mysqlConnection = mysql.createPool(config.mysql);

// mysqlConnection.connect(function(err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + mysqlConnection.threadId);
// });

export { mysqlConnection };
