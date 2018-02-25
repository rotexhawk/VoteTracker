import React from 'react';
import Select from './Select';
import Input from './Input';

let RowMapper = ({ fields, selectChange, inputChange }) => {
	let formElms = fields.map((field) => {
		if (field.name === 'select') {
			return getSelect(field, selectChange);
		} else if (field.name === 'input') {
			return getInput(field, inputChange);
		}
	});
	return <div className="select-container">{formElms}</div>;
};

let getSelect = (select, selectChange) => (
	<Select
		key={select.id}
		{...select}
		onChange={(e) => {
			selectChange(select.id, e.target.value);
		}}
	/>
);

let getInput = (input, inputChange) => (
	<Input
		key={input.id}
		{...input}
		onChange={(e) => {
			inputChange(input.id, e.target.value);
		}}
	/>
);

export default RowMapper;
