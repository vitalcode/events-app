import {combineReducers} from 'redux'
import entities from '../reducers/entities'
import player from '../reducers/player'
import playlists from '../reducers/playlists'

const rootReducer = combineReducers({
  entities,
  player,
  playlists,
})

export default rootReducer
