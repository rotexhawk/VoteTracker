import Votes from '../models/Votes';
import Election from '../models/Election';

export default class VotesController {
	constructor(date, type, update = false) {
		this.setYear(date);
		this.setTable(type);
		this.setUpdate(update);
		this.votes = new Votes(this.getTable(), this.getUpdate());
		this.election = new Election(this.getTable(), type, date);
	}

	setYear(date) {
		this.year = date.get('year');
	}

	getYear() {
		return this.year;
	}

	setUpdate(update) {
		this.update = update;
	}

	getUpdate() {
		return this.update;
	}

	setTable(electionType) {
		if (electionType === 'primary') {
			this.table = `prim${this.getYear()}`;
		} else if (electionType === 'general') {
			this.table = `gen${this.getYear()}`;
		} else {
			this.table = `prim_sec${this.getYear()}`;
		}
	}

	getTable() {
		return this.table;
	}

	importCSV(csv) {
		return new Promise((resolve, reject) => {
			this.votes
				.importCSV(csv)
				.then((rows) => {
					this.election
						.save()
						.then(() => resolve(rows))
						.catch(reject);
				})
				.catch(reject);
		});
	}
}
