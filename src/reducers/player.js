import * as types from '../constants/ActionTypes';

const initialState = {
  events: [],
  selectedDate: null,
  selectedEvent: null
};

export default function player(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_PLAYING_SONG:
      return Object.assign({}, state, {
        playingSongId: action.event
      });
    default:
      return state;
  }
}
