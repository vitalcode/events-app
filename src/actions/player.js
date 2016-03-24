import * as types from '../constants/ActionTypes';

function fetchEventDescription(url) {
  return (dispatch, getState) => {
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
        dispatch(receiveEventDescription(event))
      })
      .catch(error => console.log(error))
  }
}

function receiveEventDescription(event) {
  return {
    type: types.CHANGE_PLAYING_SONG,
    event: event
  };
}

export function showEventDescription(id) {
  return (dispatch, getState) => {
    const eventUrl = `http://192.168.59.1:9200/lisenok/events/${encodeURIComponent(id)}`
    return dispatch(fetchEventDescription(eventUrl))
  };
}

