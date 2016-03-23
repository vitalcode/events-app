import * as types from '../constants/ActionTypes';
import {CHANGE_TYPES} from '../constants/SongConstants';

export function changePlayerStatus(status) {
  return {
    type: types.CHANGE_PLAYER_STATUS,
    status
  }
}

export function changeCurrentTime(time) {
  return {
    type: types.CHANGE_CURRENT_TIME,
    time
  };
}


export function receiveSong(event) {
  return {
    type: types.CHANGE_PLAYING_SONG,
    event: event
  };
}

export function changePlayingSong(id) {
  return (dispatch, getState) => {
    const eventUrl = `http://192.168.59.1:9200/lisenok/events/${encodeURIComponent(id)}`
    return dispatch(fetchSong(eventUrl))
  }
}

function fetchSong(url) {
  return (dispatch, getState) => {
    // dispatch(requestSongs(playlist))
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const source = json._source
        const event = {
          id: json._id,
          description: source.description && source.description.length > 0 ? source.description[0] : '',
          image: source.image && source.image.length > 0 ? source.image[0] : '',
          from: source.from && source.from.length > 0 ? source.from[0] : '',
          to: source.to && source.to.length > 0 ? source.to[0] : ''
        }

        dispatch(receiveSong(event))
      })
      .catch(error => console.log(error))
  }
}


export function changeSelectedPlaylists(playlists, playlist) {
  const index = playlists.indexOf(playlist);
  if (index > -1) {
    playlists.splice(index, 1);
  }
  playlists.push(playlist);

  return {
    type: types.CHANGE_SELECTED_PLAYLISTS,
    playlists
  }
}

export function changeSong(changeType) {
  return (dispatch, getState) => {
    const {player, playlists} = getState();
    const {currentSongIndex, selectedPlaylists} = player;
    const currentPlaylist = selectedPlaylists[selectedPlaylists.length - 1];
    let newSongIndex;

    if (changeType === CHANGE_TYPES.NEXT) {
      newSongIndex = currentSongIndex + 1;
    } else if (changeType === CHANGE_TYPES.PREV) {
      newSongIndex = currentSongIndex - 1;
    } else if (changeType === CHANGE_TYPES.SHUFFLE) {
      newSongIndex = Math.floor((Math.random() * playlists[currentPlaylist].items.length - 1) + 0);
    }

    if (newSongIndex >= playlists[currentPlaylist].items.length || newSongIndex < 0) {
      return null;
    }

    return dispatch(changePlayingSong(newSongIndex));
  }
}

export function playSong(id) {
  return (dispatch, getState) => {
    dispatch(changeCurrentTime(0));

    // const {player} = getState();
    // const {selectedPlaylists} = player;
    // const len = selectedPlaylists.length;
    // if (len === 0 || selectedPlaylists[len - 1] !== playlist) {
    //     dispatch(changeSelectedPlaylists(selectedPlaylists, playlist));
    // }
    dispatch(changePlayingSong(id));
  };
}
