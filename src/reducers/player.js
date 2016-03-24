import * as types from '../constants/ActionTypes';

export default function player(state = {
  currentSongIndex: null,
  currentTime: 0,
  selectedPlaylists: [],
  status: 'init'
}, action) {
  switch (action.type) {
    case types.CHANGE_PLAYING_SONG:
      return Object.assign({}, state, {
        playingSongId: action.event
      });
    default:
      return state;
  }
}
