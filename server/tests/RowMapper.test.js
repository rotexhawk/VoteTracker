import RowMapper from '../controllers/RowMapper';

const row = [
    'county_desc',
    'voter_reg_num',
    'ncid',
    'voter_last_name',
    'voter_first_name',
    'voter_middle_name',
    'race',
    'gender',
    'age',
    'voter_street_address',
    'voter_city',
    'voter_state',
    'voter_zip',
    'ballot_mail_street_address',
    'ballot_mail_city',
    'ballot_mail_state',
    'ballot_mail_zip',
    'other_mail_addr1',
    'other_mail_addr2',
    'other_city_state_zip',
    'election_dt',
    'voter_party_code',
    'precinct_desc',
    'cong_dist_desc',
    'nc_house_desc',
    'nc_senate_desc',
    'ballot_req_delivery_type',
    'ballot_req_type',
    'ballot_request_party',
    'ballot_req_dt',
    'ballot_send_dt',
    'ballot_rtn_dt',
    'ballot_rtn_status',
    'site_name',
    'sdr',
    'mail_veri_status'
];
const rowMapper = new RowMapper('test00.csv', row);

test('RowMapper Transform Sex', () => {
    expect(rowMapper.transformSex('A')).toBe('U');
});

test('RowMapper Transform Sex', () => {
    expect(rowMapper.transformSex('M')).toBe('M');
});

test('RowMapper Transform Race', () => {
    expect(rowMapper.transformRace('BLACK or AFRICAN AMERICAN')).toBe('B');
});

test('RowMapper Transform Race', () => {
    expect(rowMapper.transformRace('OTHER')).toBe('O');
});

test('RowMapper Transform Race', () => {
    expect(rowMapper.transformRace('whatever')).toBe('U');
});

test('RowMapper Number Only', () => {
    expect(rowMapper.numberOnly('123 whatever')).toBe('123');
});

test('RowMapper Number Only', () => {
    expect(rowMapper.numberOnly('whatever')).toBe('');
});

test('RowMapper Number Only', () => {
    expect(rowMapper.numberOnly('whateve1r')).toBe('1');
});

test('RowMapper Transform MM/DD/YYYY to YYYY-MM-DD', () => {
    expect(rowMapper.transformDate('11/23/2018')).toBe('2018-11-23');
});

test('RowMapper Transform Ballot', () => {
    expect(rowMapper.transformBallot('CIVILIAN')).toBe('C');
});

test('RowMapper Transform Ballot', () => {
    expect(rowMapper.transformBallot('MILITARY')).toBe('M');
});

test('RowMapper Transform Ballot', () => {
    expect(rowMapper.transformBallot('FAX')).toBe('L');
});

test('RowMapper Transform Ballot', () => {
    expect(rowMapper.transformBallot('ELECTIONDAY')).toBe('P');
});
