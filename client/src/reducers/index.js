import { FIELD_CHANGE, SELECT_UPDATE, FILE_CHANGE, SUBMIT, PROCESS_CSV } from '../actions';

export const rows = (state = formState(), action) => {
    switch (action.type) {
        case FIELD_CHANGE:
            return changeField(state, action);
        case SELECT_UPDATE:
            return updateFormSelect(state, action);
        case FILE_CHANGE:
            return changeFileName(state, action);
        case SUBMIT:
            return submitForm(state, action);
        case PROCESS_CSV:
            return processCSV(state, action);
        default:
            return state;
    }
};

const processCSV = (state, action) => {
    return {
        ...state,
        pages: state.pages.map(page => {
            if (page.id !== state.currentPage) {
                return page;
            }
            return {
                ...page,
                ...action.value
            };
        })
    };
};

const changeFileName = (state, action) => {
    return {
        ...state,
        ...action.value
    };
};

const updateFormSelect = (state, action) => {
    return {
        ...state,
        pages: state.pages.map(page => {
            if (page.id !== state.currentPage) {
                return page;
            }
            return {
                ...page,
                form: {
                    ...page.form,
                    ...action.value
                }
            };
        })
    };
};

const changeField = (state, action) => {
    return {
        ...state,
        pages: state.pages.map(page => {
            if (page.id !== state.currentPage) {
                return page;
            }
            return {
                ...page,
                form: {
                    ...page.form,
                    fields: page.form.fields.map(field => {
                        if (field.id !== action.id) {
                            return field;
                        }
                        return {
                            ...field,
                            ...action.value
                        };
                    })
                }
            };
        })
    };
};

const submitForm = (state, action) => {
    return {
        ...state,
        currentPage: state.currentPage + 1
    };
};

export const formState = () => {
    let state = {
        currentPage: 0,
        fileName: '',
        pages: [
            {
                id: 0,
                error: '',
                form: {
                    fields: [
                        {
                            id: 0,
                            name: 'select',
                            required: true,
                            label: 'File',
                            defaultValue: 'Select File',
                            value: '',
                            status: 'is-loading',
                            row: 'file',
                            options: []
                        },
                        {
                            id: 1,
                            name: 'input',
                            type: 'date',
                            required: true,
                            label: 'Election Date',
                            status: '',
                            row: 'election_date',
                            value: ''
                        },
                        {
                            id: 2,
                            name: 'select',
                            required: true,
                            label: 'Election Type',
                            defaultValue: 'Election Type',
                            status: '',
                            value: '',
                            row: 'election_type',
                            options: [
                                {
                                    value: 'primary',
                                    label: 'Primary Election'
                                },
                                {
                                    value: 'general',
                                    label: 'General Election'
                                },
                                {
                                    value: 'second_primary',
                                    label: 'Second Primary'
                                }
                            ]
                        },
                        {
                            id: 3,
                            name: 'input',
                            type: 'checkbox',
                            required: false,
                            label: 'Update',
                            status: '',
                            row: 'update',
                            value: ''
                        }
                    ]
                }
            },
            {
                id: 1,
                error: '',
                form: {
                    fields: []
                }
            },
            {
                id: 2,
                error: ''
            }
        ]
    };
    return state;
};
