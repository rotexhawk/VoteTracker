import Validator from '../controllers/Validator';
import moment from 'moment';

const row = [
    { name: 'file', value: 'test00.csv' },
    { name: 'election_date', value: '2018-03-14' },
    { name: 'election_type', value: 'primary' },
    { name: 'update', value: true },
    { name: 'county', value: 'county_desc' },
    { name: 'race', value: 'race' },
    { name: 'sex', value: 'gender' },
    { name: 'age', value: 'age' },
    { name: 'city', value: 'voter_city' },
    { name: 'party', value: 'voter_party_code' },
    { name: 'precinct', value: 'precinct_desc' },
    { name: 'cong_dist', value: 'cong_dist_desc' },
    { name: 'house_dist', value: 'nc_house_desc' },
    { name: 'sen_dist', value: 'nc_senate_desc' },
    { name: 'voting_method', value: 'ballot_req_type' },
    { name: 'election_lbl', value: 'ballot_req_dt' },
    { name: 'site_name', value: 'site_name' }
];

const validator = new Validator(row);

test('Validator Filename', () => {
    expect(validator.getFileName()).toBe('test00.csv');
});

test('Validator Election Date', () => {
    const date = moment('2018-03-14', 'YYYY-MM-DD');
    expect(validator.getElectionDate()).toEqual(date);
});

test('Validator Election Year', () => {
    expect(validator.getElectionYear()).toBe(2018);
});

test('Validator Election Type', () => {
    expect(validator.getElectionType()).toBe('primary');
});

test('Validator Election Type', () => {
    expect(validator.getUpdate()).toBe(true);
});

test('Validator Row', () => {
    const csvHeader = [
        { name: 'county', value: 'county_desc' },
        { name: 'race', value: 'race' },
        { name: 'sex', value: 'gender' },
        { name: 'age', value: 'age' },
        { name: 'city', value: 'voter_city' },
        { name: 'party', value: 'voter_party_code' },
        { name: 'precinct', value: 'precinct_desc' },
        { name: 'cong_dist', value: 'cong_dist_desc' },
        { name: 'house_dist', value: 'nc_house_desc' },
        { name: 'sen_dist', value: 'nc_senate_desc' },
        { name: 'voting_method', value: 'ballot_req_type' },
        { name: 'election_lbl', value: 'ballot_req_dt' },
        { name: 'site_name', value: 'site_name' }
    ];
    expect(validator.getRow()).toEqual(csvHeader);
});
