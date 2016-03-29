import {combineReducers} from 'redux'
import player from '../reducers/player'
import eventsList from '../reducers/eventsList'

const rootReducer = combineReducers({
  player,
  eventsList
});

export default rootReducer
