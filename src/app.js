import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import CoreModule from './coreModule';
import Config from 'react-native-config'

const rootModule = {
  reducer: combineReducers({
    core: CoreModule.reducer,
  }),
  container: CoreModule.containers.coreRouterContainer
};

const DimensionsProvider = CoreModule.containers.dimensionsProviderContainer;

const logger = createLogger();

const createStoreWithMiddleware = Config.logger === 'true' ? applyMiddleware(thunkMiddleware, logger)(createStore) :
  applyMiddleware(thunkMiddleware)(createStore);

const store = createStoreWithMiddleware(rootModule.reducer);
store.dispatch(CoreModule.actions.categoryEventsGet());

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DimensionsProvider>
          <rootModule.container />
        </DimensionsProvider>
      </Provider>
    )
  }
}
