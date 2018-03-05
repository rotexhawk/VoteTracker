import Database from './Database';
import moment from 'moment';

export default class Election extends Database {
	constructor(votesTable, electionType, electionDate) {
		super('elections');
		this.votesTable = votesTable;
		this.setElectionType(electionType);
		this.electionDate = electionDate.format('YYYY-MM-DD');
		this.table = 'elections';
	}

	setElectionType(type) {
		if (type === 'primary') {
			this.electionType = 'P';
		} else if (type === 'general') {
			this.electionType = 'G';
		} else {
			this.electionType = 'S';
		}
	}

	save() {
		return super
			.query('SELECT * FROM ?? where name = ?', [
				this.table,
				this.votesTable
			])
			.then((rows) => {
				if (rows.length <= 0) {
					return this.insertRow();
				}
				return this.updateRow();
			});
	}

	insertRow() {
		const args = {
			name: this.votesTable,
			election_type: this.electionType,
			election_year: this.electionDate,
			created_at: this.getTimeStamp(),
			updated_at: this.getTimeStamp()
		};
		let sql = 'INSERT INTO ?? SET ?';
		return super.query(sql, [this.table, args]);
	}

	updateRow() {
		let sql = 'UPDATE ?? SET updated_at = ? WHERE name = ?';
		return super.query(sql, [
			this.table,
			this.getTimeStamp(),
			this.votesTable
		]);
	}

	getTimeStamp() {
		return moment().format('YYYY-MM-DD HH:mm:ss');
	}
}
