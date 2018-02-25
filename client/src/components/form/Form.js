import React from 'react';
import Select from './Select';
import Input from './Input';

let Form = ({ state, fieldChange, fileChange, submit }) => {
    return state.form !== undefined ? getForm(state, fieldChange, fileChange, submit) : getPage(state);
};

const getPage = state => (
    <div className="page-content">
        {state.error.length <= 0 ? (
            <div className="vt-form">
                <article className="message is-primary">
                    <div className="message-header has-text-centered">
                        <h3 className="is-size-5">Form submission Successful.</h3>
                    </div>
                    <div className="message-body">
                        <p className="block-normal">
                            The csv file was accepted by the server. It will take a while to clean up the csv so feel
                            free to close the browser. The status report will be sent to this email.{' '}
                            <a href="mailto:susan.myrick@nccivitas.org">susan.myrick@nccivitas.org</a>
                        </p>
                        <p>
                            If you encountered any issue or don't see the new data on votetracker, please contact{' '}
                            <a href="mailto:yasinyaqoobi@gmail.com">yasinyaqoobi@gmail.com</a>
                        </p>
                    </div>
                </article>
            </div>
        ) : (
            <div className="vt-form">
                <article className="message is-danger">
                    <div className="message-header has-text-centered">
                        <h3 className="is-size-5">Form submission Failed.</h3>
                    </div>
                    <div className="message-body">
                        <p className="block-normal">The server rejected the form because of the following errors.</p>
                        <p>{state.error}</p>
                    </div>
                </article>
            </div>
        )}
    </div>
);

const getForm = (state, fieldChange, fileChange, submit) => {
    let formComponents = state.form.fields.map(field => {
        if (field.name === 'select') {
            return getSelect(field, fieldChange, fileChange);
        } else if (field.name === 'input') {
            return getInput(field, fieldChange);
        }
        return '';
    });
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                submit();
            }}
        >
            <div className="vt-form">
                <div className={state.id === 0 ? 'file-form' : 'csv-form'}>
                    {formComponents}
                    <div className="field has-submit">
                        <input type="submit" className="button is-primary" value="Submit" />
                    </div>
                </div>
            </div>
        </form>
    );
};

const getSelect = (select, selectChange, fileChange) => {
    return (
        <Select
            key={select.id}
            {...select}
            onChange={e => {
                if (select.label === 'File') {
                    fileChange(e.target.value);
                }
                selectChange(select.id, e.target.value);
            }}
        />
    );
};

const getInput = (input, inputChange) => (
    <Input
        key={input.id}
        {...input}
        onChange={e => {
            let val = input.type === 'checkbox' ? e.target.checked : e.target.value;
            inputChange(input.id, val);
        }}
    />
);

export default Form;
