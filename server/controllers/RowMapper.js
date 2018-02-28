import Reader from './Reader';
import moment from 'moment';

export default class RowMapper {
    constructor(file, row) {
        this.row = row;
        this.reader = new Reader(file);
    }

    async mapRows() {
        const csvHeader = await this.reader.getCSVHeader();
        return this.row.map(col => {
            col.index = csvHeader.indexOf(col.value);
            return col;
        });
    }

    toDBField(mappedObj, data) {
        switch (mappedObj.name) {
            case 'sex':
                return this.transformSex(data);
            case 'race':
                return this.transformRace(data);
            case 'party':
            case 'requested': // party_requested
                return this.transformParty(data);
            case 'cong_dist':
            case 'house_dist':
            case 'sen_dist':
                return this.numberOnly(data);
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

    transformSex(str) {
        if (str !== 'M' || str !== 'F') {
            return 'U'; // UNKNOWN
        }
        return str;
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

    numberOnly(str) {
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
}
