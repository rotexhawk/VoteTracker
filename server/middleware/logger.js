import path from 'path';
const winston = require('winston');
const expressWinston = require('express-winston');

export default function logger() {
    return expressWinston.errorLogger({
        transports: [
            new winston.transports.File({
                filename: path.resolve(__dirname, '..', 'logs/error-logs.log'),
                handleExceptions: true,
                json: false,
                timestamp: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: true,
                prettyPrint: true,
                meta: false,
                process: false,
                humanReadableUnhandledException: true
            })
        ]
    });
}
