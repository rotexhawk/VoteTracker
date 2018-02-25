import { connect } from 'react-redux';
import Form from '../components/form/Form';
import { changeField, submit, changeFile } from '../actions';

const mapStateToProps = state => {
    return {
        state: state.pages[state.currentPage]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fieldChange: (id, value) => dispatch(changeField(id, value)),
        fileChange: fileName => dispatch(changeFile(fileName)),
        submit: page => dispatch(submit())
    };
};

const MyForm = connect(mapStateToProps, mapDispatchToProps)(Form);

export default MyForm;
