import {
  RECEIVE_EVENTS,
  REQUEST_EVENTS,
  SEARCH_EVENTS,
  REQUEST_EVENT_DETAILS,
  COLLAPSE_HEADER
} from '../constants/ActionTypes'
import update from 'react/lib/update'
import {buildAllEventsUrl} from '../utils/urlUtils'
import moment from 'moment'

const initialState = {
  events: [],
  isLoading: null,
  clue: null,
  collapseHeader: false,
};

export default function eventsList(state = initialState, action) {
  switch (action.type) {
    case REQUEST_EVENTS:
      return update(state, {
        isLoading: {$set: true}
      });

    case RECEIVE_EVENTS:
      if (action.refresh) {
        return update(state, {
          events: {$set: eventsToDisplayEvents(action.events)},
          isLoading: {$set: false}
        });
      }
      return update(state, {
        events: {$push: eventsToDisplayEvents(action.events)},
        isLoading: {$set: false}
      });

    case REQUEST_EVENT_DETAILS:
      return update(state, {
        eventDetails: {$set: eventToDisplayEvent(action.event)}
      });

    case SEARCH_EVENTS:
      return update(state, {
        clue: {$set: action.clue}
      });

    case COLLAPSE_HEADER:
      return update(state, {
        collapseHeader: {$set: action.collapse}
      });

    default:
      return state;
  }
}

function eventsToDisplayEvents(events) {
  return events.map(event => eventToDisplayEvent(event));
}

function eventToDisplayEvent(event) {
  const fromTime = moment(event.from).format('LT');
  const toTime = event.to ? moment(event.to).format('LT') : '';
  event.timeRangeDisplay = toTime ? `${fromTime} - ${toTime}` : `${fromTime}`;
  event.title = event.description.substring(0, 80);
  return event;
}
