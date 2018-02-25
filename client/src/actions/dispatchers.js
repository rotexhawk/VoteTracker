import { changeOptions, updateSelect, processCSV } from './index';
const handleErrors = response => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

export function getFileNames(id = 0) {
    return function(dispatch) {
        return fetch('/api/filenames')
            .then(handleErrors)
            .then(response => response.json())
            .then(json => dispatch(changeOptions(id, json)))
            .catch(e => console.log(e));
    };
}

export function getHeaders(filename) {
    return function(dispatch) {
        return fetch(`/api/headers/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename })
        })
            .then(handleErrors)
            .then(response => response.json())
            .then(json => dispatch(updateSelect(json)))
            .catch(e => console.log(e));
    };
}

export function csvProcess(payload) {
    return function(dispatch) {
        console.log(JSON.stringify(prepForm(payload)));
        return fetch(`/api/processcsv/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prepForm(payload))
        })
            .then(response => response.json())
            .then(json => {
                if (json && json.error) {
                    return dispatch(processCSV(json.error));
                }
                return dispatch(processCSV(''));
            })
            .catch(e => console.log(e));
    };
}

const prepForm = fields => {
    return fields.map(field => ({
        name: field.row,
        value: field.value
    }));
};
