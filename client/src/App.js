import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';
import MyForm from './containers/form';
import { connect } from 'react-redux';
import { getFileNames, getHeaders, csvProcess } from './actions/dispatchers';
import PropTypes from 'prop-types';

class App extends Component {
    constructor(props) {
        super(props);
        this.alreadyUpdated = false;
        this.alreadyProcessed = false;
    }
    componentDidMount() {
        const { dispatch, currentPage } = this.props;
        if (currentPage === 0) {
            dispatch(getFileNames());
        }
    }

    componentDidUpdate() {
        const { dispatch, currentPage, fileName, fields } = this.props;
        if (currentPage === 1 && fileName !== '' && !this.alreadyUpdated) {
            this.alreadyUpdated = true;
            dispatch(getHeaders(fileName));
        } else if (currentPage === 2 && !this.alreadyProcessed) {
            console.log('csvProcess gets triggered');
            this.alreadyProcessed = true;
            dispatch(csvProcess(fields));
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Votetracker Form</h1>
                </header>
                <div className="app-container section">
                    <div className="container">
                        <MyForm />
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired
};

const getFields = state => {
    let fields = state.pages
        .filter(page => page.form !== undefined)
        .reduce((acc, curr) => acc.concat(curr.form.fields), []);
    return fields;
};

function mapStateToProps(state) {
    getFields(state);
    return {
        currentPage: state.currentPage,
        fileName: state.fileName,
        fields: getFields(state)
    };
}

export default connect(mapStateToProps)(App);
