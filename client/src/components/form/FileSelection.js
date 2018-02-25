import React from 'react';
import PropTypes from 'prop-types';
import Select from './Select';
import Input from './Input';

let FileSelection = ({ form, selectChange, inputChange }) => {
	let formElms = form.fields.map((field) => {
		if (field.name === 'select') {
			return getSelect(field, selectChange);
		} else if (field.name === 'input') {
			return getInput(field, inputChange);
		}
	});
	return <div className="file-form">{formElms}</div>;
};

let getSelect = (select, selectChange) => {
	return (
		<Select
			key={select.id}
			{...select}
			onChange={(e) => {
				selectChange(select.id, e.target.value);
			}}
		/>
	);
};

let getInput = (input, inputChange) => (
	<Input
		key={input.id}
		{...input}
		onChange={(e) => {
			inputChange(input.id, e.target.value);
		}}
	/>
);

export default FileSelection;
