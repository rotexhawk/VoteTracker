export const FIELD_CHANGE = 'FIELD_CHANGE';
export const changeField = (id, value) => ({
    type: FIELD_CHANGE,
    id,
    value: { value }
});

export const changeOptions = (id, value) => {
    return {
        type: FIELD_CHANGE,
        id,
        value: { options: value, status: '' }
    };
};

export const SUBMIT = 'SUBMIT';
export const submit = () => ({
    type: SUBMIT
});

export const SELECT_UPDATE = 'SELECT_UPDATE';
export const updateSelect = options => {
    return {
        type: SELECT_UPDATE,
        value: { fields: getRows(options) }
    };
};

export const FILE_CHANGE = 'FILE_CHANGE';
export const changeFile = fileName => {
    return {
        type: FILE_CHANGE,
        value: { fileName }
    };
};

export const PROCESS_CSV = 'PROCESS_CSV';
export const processCSV = res => {
    return {
        type: PROCESS_CSV,
        value: { error: res }
    };
};

const getRows = (options = []) => {
    // gen elections data
    // county,race,sex,age,city,party,precinct,cong_dist,house_dist,sen_dist,voting_method,election_lbl
    const rows = [
        {
            label: 'County',
            name: 'county',
            value: 'county_desc'
        },
        {
            label: 'Race',
            name: 'race',
            value: 'race'
        },
        {
            label: 'Gender',
            name: 'sex',
            value: 'gender'
        },
        {
            label: 'Age',
            name: 'age',
            value: 'age'
        },
        {
            label: 'Voter City',
            name: 'city',
            value: 'voter_city'
        },
        {
            label: 'Voter Party',
            name: 'party',
            value: 'voter_party_code'
        },
        {
            label: 'Precinct',
            name: 'precinct',
            value: 'precinct_desc'
        },
        {
            label: 'Congress District',
            name: 'cong_dist',
            value: 'cong_dist_desc'
        },
        {
            label: 'House District',
            name: 'house_dist',
            value: 'nc_house_desc'
        },
        {
            label: 'Senate District',
            name: 'sen_dist',
            value: 'nc_senate_desc'
        },
        {
            label: 'Voting Method',
            name: 'voting_method',
            value: 'ballot_req_type'
        },
        {
            label: 'Election Date',
            name: 'election_lbl',
            value: 'ballot_req_dt'
        },
        {
            label: 'Site Name',
            name: 'site_name',
            value: 'site_name'
        }
    ];
    return rows.map((select, index) => {
        return {
            id: index,
            name: 'select',
            required: true,
            label: select.label,
            row: select.name,
            value: select.value,
            status: options.length > 0 ? '' : 'is-loading',
            options: options
        };
    });
};
