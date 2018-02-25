import Reader from './Reader';

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
}
