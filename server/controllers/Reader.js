import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';
import parse from 'csv-parse';

export default class Reader {
    constructor(file) {
        this.setReadPath(file);
        this.setWritePath(file);
    }

    setReadPath(file) {
        this.readPath = path.join(__dirname, '../../', 'public/raw_csv/', file);
    }

    getReadPath() {
        return this.readPath;
    }

    setWritePath(file) {
        this.writePath = path.join(__dirname, '../../', 'public/filtered_csv/', file);
    }

    getWritePath() {
        return this.writePath;
    }

    getReadStream(opts) {
        return fs.createReadStream(this.getReadPath(), Object.assign({ encoding: 'utf8' }, opts));
    }

    getWriteStream(opts) {
        return fs.createWriteStream(this.getWritePath());
    }

    getTransformStream(transformer) {
        return new Transform({
            transform(chunk, encoding, callback) {
                try {
                    this.push(transformer(chunk));
                    callback();
                } catch (e) {
                    callback(e, chunk);
                }
            }
        });
    }

    async getCSVHeader() {
        if (!this.csvHeader) {
            await this.setCSVHeader();
        }
        return this.csvHeader;
    }

    async setCSVHeader() {
        let stream = this.getReadStream({ highWaterMark: 1024 });
        this.csvHeader = await new Promise((resolve, reject) => {
            stream
                .pipe(parse())
                .on('data', headerArr => {
                    stream.destroy();
                    resolve(headerArr);
                })
                .on('error', reject);
        });
    }
}
