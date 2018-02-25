import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import App from './App.js';
import { rows } from './reducers';

let store = createStore(rows, applyMiddleware(thunkMiddleware));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
