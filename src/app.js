import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import CoreModule from './coreModule';

const rootModule = {
  reducer: combineReducers({
    core: CoreModule.reducer,
  }),
  container: CoreModule.containers.coreRouterContainer
};

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);
const store = createStoreWithMiddleware(rootModule.reducer);

store.dispatch(CoreModule.actions.updateEvents());

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <rootModule.container />
      </Provider>
    )
  }
}
