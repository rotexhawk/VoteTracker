import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';
import parse from 'csv-parse';
import folderPaths from '../config/paths.json';

export default class Reader {
    constructor(file) {
        this.setReadPath(file);
        this.setWritePath(file);
    }

    setReadPath(file) {
        this.readPath = path.join(__dirname, '../../', folderPaths.raw, file);
    }

    getReadPath() {
        return this.readPath;
    }

    setWritePath(file) {
        this.writePath = path.join(__dirname, '../../', folderPaths.processed, file);
    }

    getWritePath() {
        return this.writePath;
    }

    deleteFile(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, err => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }

    deleteReadFile() {
        return this.deleteFile(this.getReadPath());
    }

    deleteWriteFile() {
        return this.deleteFile(this.getWritePath());
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
