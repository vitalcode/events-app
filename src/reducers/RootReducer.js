import {combineReducers} from 'redux'
import eventsList from '../reducers/eventsList'

const RootReducer = combineReducers({
  eventsList
});

export default RootReducer
