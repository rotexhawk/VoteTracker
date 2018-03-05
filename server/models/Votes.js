import Database from './Database';

export default class Votes extends Database {
	constructor(table, update = false) {
		super(table);
		this.table = table;
		this.update = update;
	}

	tableExists() {
		return super.query('SHOW TABLES LIKE ?', [this.table]).then((rows) => {
			return rows.length > 0;
		});
	}

	createTable() {
		const sql = `CREATE TABLE ?? (
            id int(10) unsigned NOT NULL AUTO_INCREMENT,
            county varchar(255) DEFAULT NULL,
            race enum('B', 'I', 'W', 'A', 'T', 'O', 'U') NOT NULL,
            sex enum('M','F','U') NOT NULL,
            age int(11) DEFAULT NULL,
            city varchar(255) DEFAULT NULL,
            party enum('R','D','L','U') NOT NULL,
            precinct varchar(255) DEFAULT NULL,
            cong_dist int(11) DEFAULT NULL,
            house_dist int(11) DEFAULT NULL,
            sen_dist int(11) DEFAULT NULL,
            voting_method enum('C','M','G','S', 'V', 'B', 'T', 'E', 'L', 'O', 'P') NOT NULL,
            election_lbl date DEFAULT NULL,
            site_name varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
        )`;

		return this.dropTable().then(() => {
			return super.query(super.format(sql, [this.table]));
		});
	}

	dropTable() {
		return super.query(`DROP Table IF EXISTS ${this.table}`);
	}

	importCSV(csv) {
		const sql = `LOAD DATA INFILE ? INTO TABLE ${this.table}
        FIELDS TERMINATED BY ','
        OPTIONALLY ENCLOSED BY '"'
        LINES TERMINATED BY '\n'
        IGNORE 1 LINES (county,race,sex,age,city,party,precinct,@vcong_dist,@vhouse_dist,@vsen_dist,voting_method,@velection_lbl,@vsite_name)
        SET
        cong_dist = nullif(@vcong_dist, ''),
        house_dist = nullif(@vhouse_dist, ''),
        sen_dist = nullif(@vsen_dist, ''),
        site_name = nullif(@vsite_name, ''),
        election_lbl  = nullif(@velection_lbl, '')`;

		return this.tableExists().then((tableExists) => {
			if (this.update && tableExists) {
				return super.query(sql, [csv, this.table]);
			}
			return this.createTable().then(() =>
				super.query(sql, [csv, this.table])
			);
		});
	}
}
