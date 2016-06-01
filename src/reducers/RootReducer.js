import {combineReducers} from 'redux'
import _ from 'lodash';
//import eventsList from '../reducers/eventsList'
import {reducer} from '../coreModule'

const RootReducer = combineReducers({
  core: reducer,
  //eventsList: eventsList
});

export default RootReducer
