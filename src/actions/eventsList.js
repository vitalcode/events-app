import {
  REQUEST_EVENTS,
  RECEIVE_EVENTS,
  SEARCH_EVENTS,
  DATE_SELECTED,
  REQUEST_EVENT_DETAILS,
  COLLAPSE_HEADER
} from '../constants/ActionTypes'
import {buildAllEventsUrl, updateTotal} from '../utils/urlUtils'

export function collapseHeader(collapse) {
  return {
    type: COLLAPSE_HEADER,
    collapse: collapse
  }
}

export function fetchEventDetails(id) {
  return (dispatch, getState) => {
    const eventUrl = `http://192.168.59.1:9200/lisenok/events/${encodeURIComponent(id)}`
    return dispatch(fetchEventDescription(eventUrl))
  };
}

function fetchEventDescription(url) {
  return (dispatch, getState) => {
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const source = json._source;
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
    type: REQUEST_EVENT_DETAILS,
    event: event
  };
}

export function fetchEvents() {
  return (dispatch, getState) => {
    const {eventsList} = getState();
    if (eventsList && !eventsList.isLoading && eventsList.nextPageUrl) {
      const url = eventsList.nextPageUrl;
      dispatch(requestEvents());
      return fetch(url)
        .then(response => response.json())
        .then(json => {
          console.log('fetchEvents', json);
          updateTotal(json);
          const events = json.hits.hits
            .map(hit => {
              const source = hit._source;
              return {
                id: hit._id,
                description: source.description && source.description.length > 0 ? source.description[0] : '',
                image: source.image && source.image.length > 0 ? source.image[0] : '',
                from: source.from && source.from.length > 0 ? source.from[0] : '',
                to: source.to && source.to.length > 0 ? source.to[0] : ''
              }
            });
          dispatch(receiveEvents(events, buildAllEventsUrl()))
        })
        .catch(error => console.log(error))
    }
  }
}

function requestEvents() {
  return {
    type: REQUEST_EVENTS
  }
}

function receiveEvents(events, nextPageUrl) {
  return {
    type: RECEIVE_EVENTS,
    events: events,
    nextPageUrl: nextPageUrl
  }
}

export function searchEvents(clue) {
  return {
    type: SEARCH_EVENTS,
    clue: clue
  }
}

export function dateSelected(date) {
  return {
    type: DATE_SELECTED,
    date: date
  }
}




