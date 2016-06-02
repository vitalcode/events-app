import React, {Component} from 'react-native'
import {Provider} from 'react-redux';
import Router from './router'
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import RootReducer from './reducers/RootReducer';
import {actions} from './coreModule';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);

// function configureStore(initialState) {
//   return createStoreWithMiddleware(RootReducer, initialState)
// }

const store = createStoreWithMiddleware(RootReducer);

store.dispatch(actions.updateEvents());

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}

