import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ id, value, type, label, required, onChange }) => (
    <div className="field">
        <label className="label">{label}</label>

        <input
            className={type === 'checkbox' ? '' : 'input'}
            id={id}
            type={type}
            value={value}
            required={required}
            onChange={onChange}
        />
    </div>
);

Input.propTypes = {
    id: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Input;
