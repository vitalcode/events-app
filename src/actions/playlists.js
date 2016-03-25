import * as types from '../constants/ActionTypes'
import {constructUrl} from '../utils/SongUtils'

function fetchEvents(url, playlist) {
  return (dispatch, getState) => {
    dispatch(requestSongs(playlist))
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const events = json.hits.hits
          .map(hit => {
            const source = hit._source
            return {
              id: hit._id,
              description: source.description && source.description.length > 0 ? source.description[0]: '',
              image: source.image && source.image.length > 0 ? source.image[0]: '',
              from: source.from && source.from.length > 0 ? source.from[0]: '',
              to: source.to && source.to.length > 0 ? source.to[0]: ''
            }
          })

        dispatch(receiveSongs(events))
      })
      .catch(error => console.log(error))
  }
}

function getNextUrl(playlists, playlist) {
  const activePlaylist = playlists[playlist]
  if (!activePlaylist || activePlaylist.nextUrl === false) {
    return constructUrl(playlist)
  }
  return activePlaylist.nextUrl
}

function receiveSongs(events) {
  return {
    type: types.RECEIVE_SONGS,
    events: events,
  }
}

function requestSongs(playlist) {
  return {
    type: types.REQUEST_SONGS,
    playlist: playlist
  }
}


function shouldFetchEvents(playlists, playlist) {
  const activePlaylist = playlists[playlist]
  if (!activePlaylist || !activePlaylist.isFetching && (activePlaylist.nextUrl !== null)) {
    return true
  }

  return false
}

export function fetchEventsIfNeeded(playlist) {
  return (dispatch, getState) => {
    const {playlists, songs} = getState()
    if (shouldFetchEvents(playlists, playlist)) {
      const nextUrl = 'http://192.168.59.1:9200/lisenok/_search' //getNextUrl(playlists, playlist)
      return dispatch(fetchEvents(nextUrl, playlist))
    }
  }
}