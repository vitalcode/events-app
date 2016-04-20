import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import RootReducer from '../reducers/RootReducer';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(RootReducer, initialState)
}


/*
store
{
  page: {
    isLoading: false,
    events: [{}, {}],
    nextPageUrl
  }
  selectedEvent: {}
  selectedDate: date
}
 */


