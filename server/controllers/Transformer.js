import Reader from './Reader';
import RowMapper from './RowMapper';
import parse from 'csv-parse';
import stringify from 'csv-stringify';
import transform from 'stream-transform';

export default class Transformer {
    constructor(file, row) {
        this.reader = new Reader(file);
        this.rowMapper = new RowMapper(file, row);
        this.isHeaders = true;
    }

    async transform() {
        const mappedRows = await this.rowMapper.mapRows();

        return new Promise((resolve, reject) => {
            this.reader
                .getReadStream()
                .pipe(parse())
                .pipe(transform(this.transformer(mappedRows)))
                .pipe(stringify())
                .pipe(this.reader.getWriteStream())
                .on('error', e => {
                    reject(e);
                })
                .on('finish', () => {
                    resolve(this.reader.getWritePath());
                });
        });
    }

    transformer(mappedRows) {
        return line => {
            if (this.isHeaders) {
                this.isHeaders = false;
                return mappedRows.map(col => col.name);
            }
            return mappedRows.map(
                col => (col.index < line.length ? this.rowMapper.toDBField(col, line[col.index]) : '')
            );
        };
    }

    destroy() {
        return new Promise((resolve, reject) => {
            this.reader
                .deleteReadFile()
                .then(this.reader.deleteWriteFile())
                .then(bool => resolve(bool))
                .catch(reject);
        });
    }
}
