import {arrayOf, normalize} from 'normalizr'
import * as types from '../constants/ActionTypes'
import {songSchema} from '../constants/Schemas'
import {constructUrl} from '../utils/SongUtils'

function fetchSongs(url, playlist) {
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

        // const songs = json.collection.filter(song => song.streamable && song.duration < 600000 )
        // const nextUrl = json.next_href
        // const normalized = normalize(songs, arrayOf(songSchema))
        // dispatch(receiveSongs(normalized.entities, normalized.result, nextUrl, playlist))
      })
      .catch(error => console.log(error))
  }
}

export function fetchSongsIfNeeded(playlist) {
  return (dispatch, getState) => {
    const {playlists, songs} = getState()
    if (shouldFetchSongs(playlists, playlist)) {
      const nextUrl = 'http://192.168.59.1:9200/lisenok/_search' //getNextUrl(playlists, playlist)
      return dispatch(fetchSongs(nextUrl, playlist))
    }
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
    // entities,
    // nextUrl,
    // playlist,
    // songs
  }
}

function requestSongs(playlist) {
  return {
    type: types.REQUEST_SONGS,
    playlist: playlist
  }
}

function shouldFetchSongs(playlists, playlist) {
  const activePlaylist = playlists[playlist]
  if (!activePlaylist || !activePlaylist.isFetching && (activePlaylist.nextUrl !== null)) {
    return true
  }

  return false
}

export function changePlaylist(playlist) {
  return {
    type: types.CHANGE_PLAYLIST,
    playlist: playlist
  }
}
