import React, {Component} from 'react-native'
import {Provider} from 'react-redux';
import Router from './router'
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import RootReducer from './reducers/RootReducer';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);

function configureStore(initialState) {
  return createStoreWithMiddleware(RootReducer, initialState)
}

export default class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <Router />
      </Provider>
    )
  }
}

