import * as types from '../constants/ActionTypes'
import {constructUrl} from '../utils/SongUtils'

export default function playlists(state = {}, action) {
  switch (action.type) {
    case types.RECEIVE_SONGS:
      return Object.assign({}, state, {entities: action.events})

    case types.REQUEST_SONGS:
      return Object.assign({}, state, {
        [action.playlist]: playlist(state[action.playlist], action)
      })

    default:
      return state
  }
}

function playlist(state = {
  isFetching: false,
  items: [],
  nextUrl: false
}, action) {
  switch (action.type) {
    case types.RECEIVE_SONGS:
      return Object.assign({}, state, {
        isFetching: false,
        items: [...state.items, ...action.events],
      })

    case types.REQUEST_SONGS:
      return Object.assign({}, state, {
        isFetching: true,
        nextUrl: null
      })

    default:
      return state
  }
}
