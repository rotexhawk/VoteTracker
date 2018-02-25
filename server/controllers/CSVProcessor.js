import { pickBy } from 'lodash';
import ServerError from '../utils/ServerError';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

export default class CSVProcess {
    constructor(data) {
        this.setSchema();
        this.setFields(data);
    }

    setSchema() {
        this.schema = [
            { name: 'county' },
            { name: 'race' },
            { name: 'sex' },
            { name: 'age' },
            { name: 'city' },
            { name: 'party' },
            { name: 'precinct' },
            { name: 'cong_dist' },
            { name: 'house_dist' },
            { name: 'sen_dist' },
            { name: 'voting_method' },
            { name: 'election_lbl' },
            { name: 'site_name' }
        ];
    }
    setFields(data) {
        this.setFileName(this.find(data, { name: 'file' }));
        this.setElectionDate(this.find(data, { name: 'election_date' }));
        this.setElectionYear(this.getElectionDate());
        this.setElectionType(this.find(data, { name: 'election_type' }));
        this.setUpdate(this.find(data, { name: 'update' }));
        this.setRow(
            this.except(
                data,
                { name: 'election_date' },
                { name: 'election_type' },
                { name: 'file' },
                { name: 'update' }
            )
        );
    }

    find(data, ...objs) {
        return data.filter(elm => {
            return (
                objs.filter(obj => {
                    for (let prop in obj) {
                        return elm.hasOwnProperty(prop) && obj[prop] === elm[prop];
                    }
                }).length > 0
            );
        });
    }

    except(data, ...objs) {
        return data.filter(elm => {
            return (
                objs.filter(obj => {
                    for (let prop in obj) {
                        return elm.hasOwnProperty(prop) && obj[prop] === elm[prop];
                    }
                }).length <= 0
            );
        });
    }

    setFileName(filename) {
        if (!filename || filename.length <= 0 || filename[0].value == null) {
            throw new ServerError(400, `Missing filename.`);
        }
        this.filename = filename.pop().value;
        if (!fs.existsSync(path.join(__dirname, '../../', 'public/raw_csv/', this.filename))) {
            throw new ServerError(400, `Filename ${this.filename} cannot be found on the server.`);
        }
    }

    getFileName() {
        return this.filename;
    }

    setElectionDate(electionDate) {
        try {
            let str = electionDate.pop().value;
            if (moment(str, 'YYYY-MM-DD').isValid()) {
                this.electionDate = moment(str, 'YYYY-MM-DD');
            } else {
                throw new Error('Invalid Date');
            }
        } catch (e) {
            throw new ServerError(400, 'Missing election date or wrong format. Expecting YYYY-MM-DD.', e);
        }
    }

    getElectionDate() {
        return this.electionDate;
    }

    setElectionYear(date) {
        this.electionYear = date.get('year');
    }

    getElectionYear() {
        return this.electionYear;
    }

    setElectionType(electionType) {
        try {
            this.electionType = electionType.pop().value;
        } catch (e) {
            throw new ServerError(400, 'Missing election type.', e);
        }
    }

    getElectionType() {
        return this.electionType;
    }

    setUpdate(update) {
        try {
            this.update = update.pop().value;
        } catch (e) {
            throw new ServerError(400, 'Missing update method.', e);
        }
    }

    getUpdate() {
        return this.update;
    }

    setRow(row) {
        for (let i = 0; i < this.schema.length; i++) {
            let schemaObj = this.find(row, { name: this.schema[i].name }).pop();
            if (schemaObj === undefined || schemaObj.value === '') {
                throw new ServerError(400, `Missing Field for ${this.schema[i].name}.`);
            }
        }
        this.row = row;
    }

    getRow() {
        return this.row;
    }
}
