import Database from './Database';
import moment from 'moment';

export default class Election extends Database {
    constructor(votesTable, electionType, electionDate) {
        super('elections');
        this.votesTable = votesTable;
        this.setElectionType(electionType);
        this.electionDate = electionDate.format('YYYY-MM-DD');
    }

    setElectionType(type) {
        if (type === 'primary') {
            this.electionType = `P`;
        } else if (type === 'general') {
            this.electionType = `G`;
        } else {
            this.electionType = `S`;
        }
    }

    save() {
        return super.query('SELECT * FROM elections where name = ?', [this.votesTable]).then(rows => {
            if (rows.length <= 0) {
                return this.insertRow();
            }
            return this.updateRow();
        });
    }

    insertRow() {
        const timeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const args = {
            name: this.votesTable,
            election_type: this.electionType,
            election_year: this.electionDate,
            created_at: timeStamp,
            updated_at: timeStamp
        };
        let sql = 'INSERT INTO elections SET ?';
        return super.query(sql, args);
    }

    updateRow() {
        const timeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = 'UPDATE elections SET  updated_at = ? WHERE name = ?';
        return super.query(sql, [timeStamp, this.votesTable]);
    }
}
