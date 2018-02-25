import Reader from './Reader';
import RowMapper from './RowMapper';
import { findIndex, find } from 'lodash';
import parse from 'csv-parse';
import stringify from 'csv-stringify';
import transform from 'stream-transform';
import moment from 'moment';

export default class TransformCSV {
    constructor(file, row) {
        this.reader = new Reader(file);
        this.rowMapper = new RowMapper(file, row);
        this.isHeaders = true;
    }

    async transform() {
        const mappedRows = await this.rowMapper.mapRows();
        console.log(mappedRows);

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
            return mappedRows.map(col => (col.index < line.length ? this.toDBField(col, line[col.index]) : ''));
        };
    }

    toDBField(mappedObj, data) {
        switch (mappedObj.name) {
            case 'sex':
                return this.toSex(data);
            case 'race':
                return this.transformRace(data);
            case 'party':
            case 'requested': // party_requested
                return this.transformParty(data);
            case 'cong_dist':
            case 'house_dist':
            case 'sen_dist':
                return this.toNumber(data);
            case 'ballot_rtn_dt':
            case 'ballot_req_dt':
            case 'election_lbl':
                return this.transformDate(data);
            case 'voting_method':
                return this.transformBallot(data);
            default:
                return data;
        }
    }

    toSex(str) {
        return str || 'U'; // UNDESIGNATED
    }

    transformRace(race) {
        switch (race) {
            case 'BLACK or AFRICAN AMERICAN':
                return 'B';
            case 'INDIAN AMERICAN or ALASKA NATIVE':
                return 'I';
            case 'WHITE':
                return 'W';
            case 'ASIAN':
                return 'A';
            case 'TWO or MORE RACES':
                return 'T';
            case 'OTHER':
                return 'O'; // Other
            default:
                return 'U'; // UNDESIGNATED
        }
    }

    transformParty(party) {
        switch (party) {
            case 'DEM':
                return 'D';
            case 'REP':
                return 'R';
            case 'LIB':
                return 'L'; // libertarian
            default:
                return 'U'; // Unaffiliated
        }
    }

    toNumber(str) {
        return str.replace(/\D/g, '');
    }

    transformDate(str) {
        return moment(str, 'MM/DD/YYYY').isValid() === true ? moment(str, 'MM/DD/YYYY').format('YYYY-MM-DD') : '';
    }

    transformBallot(ballot) {
        switch (ballot) {
            case 'CIVILIAN':
                return 'C';

            case 'MILITARY':
                return 'M';

            case 'LEGACY':
                return 'G';

            case 'OVERSEAS':
                return 'S';

            case 'PROVISIONAL':
            case 'PROV':
                return 'V';

            case 'CURBSIDE':
                return 'B';

            case 'TRANSFER':
                return 'T';

            case 'ELIG-NV':
                return 'E';

            case 'LEGACY':
            case 'MAIL':
            case 'FAX':
            case 'E-MAIL':
                return 'L';

            case 'ONE-STOP':
                return 'O';

            case 'ELECTIONDAY':
            case 'IN-PERSON':
                return 'P';

            default:
                return 'P';
        }
    }

    async getUnique(obj) {
        let stream = this.reader.getReadStream();
        const mappedRows = await this.rowMapper.mapRows();
        const matcher = find(mappedRows, obj);
        console.log(matcher);
        let uniqueElms = new Set();
        stream
            .pipe(parse())
            .pipe(
                transform(data => {
                    data.forEach((col, index) => {
                        if (index === matcher.index) {
                            uniqueElms.add(col);
                        }
                    });
                })
            )
            .on('finish', () => console.log('These are the Unique elements.', uniqueElms));
    }
}

// Load Script
// LOAD DATA INFILE '/var/www/upload/filteredCSVS/absentee_20161108.csv' REPLACE INTO TABLE test
// FIELDS TERMINATED BY ','
// OPTIONALLY ENCLOSED BY '"'
// LINES TERMINATED BY '\n'
// IGNORE 1 LINES (county,race,sex,age,city,party,precinct,@vcong_dist,@vhouse_dist,@vsen_dist,voting_method,@velection_lbl,@vsite_name)
// SET
// cong_dist = nullif(@vcong_dist, ''),
// house_dist = nullif(@vhouse_dist, ''),
// sen_dist = nullif(@vsen_dist, ''),
// site_name = nullif(@vsite_name, ''),
// election_lbl  = nullif(@velection_lbl, '')
// ;

// Table Script
// CREATE TABLE `test` (
//   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `county` varchar(255) DEFAULT NULL,
//   `race` enum('B', 'I', 'W', 'A', 'T', 'O', 'U') NOT NULL,
//   `sex` enum('M','F','U') NOT NULL,
//   `age` int(11) DEFAULT NULL,
//   `city` varchar(255) DEFAULT NULL,
//   `party` enum('R','D','L','U') NOT NULL,
//   `precinct` varchar(255) DEFAULT NULL,
//   `cong_dist` int(11) DEFAULT NULL,
//   `house_dist` int(11) DEFAULT NULL,
//   `sen_dist` int(11) DEFAULT NULL,
//   `voting_method` enum('C','M','G','S', 'V', 'B', 'T', 'E', 'L', 'O', 'P') NOT NULL,
//   `election_lbl` date DEFAULT NULL,
//   `site_name` varchar(255) DEFAULT NULL,
//    PRIMARY KEY (`id`)
// );
