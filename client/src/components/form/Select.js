import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ id, value, defaultValue, label, options, required, onChange, status }) => {
    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className={'select ' + (status !== undefined ? status : '')}>
                <select id={id} value={value} onChange={onChange} required={required}>
                    <option value="">{defaultValue}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

Select.propTypes = {
    id: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    required: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Select;
