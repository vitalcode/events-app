import {combineReducers} from 'redux'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createAction, createReducer} from 'redux-act';
import {createActionAsync} from 'redux-act-async';
import update from 'react/lib/update'
import moment from 'moment';
import {Config} from './config'
import {buildAllEventsUrl} from './utils/urlUtils'
import EventsSearchViewBar from './components/eventsSearchView/eventsSearchViewBar'
import EventsSearchViewBody from './components/eventsSearchView/eventsSearchViewBody'
import EventsListViewBody from './components/eventsListView/eventsListViewBody'
import EventsList from './components/common/eventsList'
import EventDetailsViewBody from './components/eventsDetailsView/eventDetailsViewBody'
import Calendar from './components/calendarView/calendar'
import CoreRouter from './coreRouter'


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

const restService = {
  getClueSuggestions(clue) {
    const url = `http://suggestqueries.google.com/complete/search?q=${clue}&client=firefox`;
    return fetch(url).then(response => response.json());
  },
  getEvents(clue, date, refresh, total, pageSize, nextPage) {
    const request = buildAllEventsUrl(clue, date, refresh, total, pageSize, nextPage);
    return request.then(response => response.json());
  },
  getEventDetails(id){
    const url = `http://${Config.host}:9200/lisenok/events/${encodeURIComponent(id)}`;
    console.log('getEventDetails url', url);
    return fetch(url).then(response => response.json());
  }
};

const actions = new function () {
  this.clueSet = createAction('CLUE_SET'),
    this.clueClear = createAction('CLUE_CLEAR'),
    this.dateSet = createAction('DATE_SET'),
    this.nextPage = createAction('UPDATE_PAGE'),
    this.pageReset = createAction('PAGE_RESET'),
    this.clueSuggest = createActionAsync('CLUE_SUGGEST', restService.getClueSuggestions),
    this.getEvents = createActionAsync('GET_EVENTS', restService.getEvents, {metaReducer: (...args) => args[1] ? args[1][2] : false}),
    this.getEventDetails = createActionAsync('GET_EVENT_DETAILS', restService.getEventDetails),
    this.updateEvents = () => (dispatch, getState) => {
      const {clue, date} = getState().core;
      const {total, pageSize, nextPage} = getState().core.events;
      console.log('updateEvents: clue, date, total, pageSize, nextPage', clue, date, total, pageSize, nextPage);

      if (!total || pageSize * nextPage < total) {
        dispatch(this.nextPage());
        dispatch(this.getEvents(clue, date, false, total, pageSize, nextPage));
      }
    },
    this.clueUpdate = clue => (dispatch, getState) => {
      // const {date} = getState().core;
      dispatch(this.clueSet(clue));
      dispatch(this.pageReset());
      dispatch(this.updateEvents());
    },
    this.dateUpdate = date => (dispatch, getState) => {
      //  const {clue} = getState().core;
      dispatch(this.dateSet(date));
      dispatch(this.pageReset());
      dispatch(this.updateEvents());
    }
};

const eventsReducer = createReducer({
  [actions.getEvents.request]: (state) => {
    return update(state, {
      requesting: {
        $set: true
      }
    });
  },
  [actions.getEvents.ok]: (state, payload, meta) => {
    console.log('meta', meta);
    const total = payload.hits.total;
    const events = payload.hits.hits
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
    return update(state, {
      requesting: {
        $set: false
      },
      list: {
        [meta ? '$set' : '$push']: eventsToDisplayEvents(events)
      },
      total: {
        $set: total
      },
      // nextPage: {
      //   $set: state.nextPage + 1
      // }
    });
  },
  [actions.getEvents.error]: (state) => {
    return update(state, {
      requesting: {
        $set: false
      }
    });
  },
  [actions.nextPage]: (state) => {
    return update(state, {
      nextPage: {
        $set: state.nextPage + 1
      }
    });
  },
  [actions.pageReset]: (state) => {
    return update(state, {
      list: {
        $set: []
      },
      total: {
        $set: 0
      },
      nextPage: {
        $set: 0
      }
    });
  }
}, {requesting: false, list: [], total: 0, pageSize: 10, nextPage: 0});

const eventDetailsReducer = createReducer({
  [actions.getEventDetails.request]: (state) => {
    return update(state, {
      requesting: {
        $set: true
      }
    });
  },
  [actions.getEventDetails.ok]: (state, payload) => {
    const source = payload._source;
    const event = {
      id: payload._id,
      description: source.description && source.description.length > 0 ? source.description[0] : '',
      image: source.image && source.image.length > 0 ? source.image[0] : '',
      from: source.from && source.from.length > 0 ? source.from[0] : '',
      to: source.to && source.to.length > 0 ? source.to[0] : ''
    };
    return update(state, {
      requesting: {
        $set: false
      },
      item: {
        $set: eventToDisplayEvent(event)
      }
    });
  },
  [actions.getEventDetails.error]: (state) => {
    return update(state, {
      requesting: {
        $set: false
      }
    });
  }
}, {requesting: false, item: {}});

const clueReducer = createReducer({
  [actions.clueSet]: (state, payload) => {
    return payload
  },
  [actions.clueClear]: () => {
    return ''
  },
}, "");

const calendarReducer = createReducer({
  [actions.dateSet]: (state, payload) => {
    return payload
  }
}, "");

const clueSuggestionsReducer = createReducer({
  [actions.clueSuggest.request]: (state) => {
    return update(state, {
      list: {
        $set: []
      },
      requesting: {
        $set: true
      }
    });
  },
  [actions.clueSuggest.ok]: (state, payload) => {
    return update(state, {
      list: {
        $set: payload[1]
      },
      requesting: {
        $set: false
      }
    });
  },
  [actions.clueSuggest.error]: (state) => {
    return update(state, {
      requesting: {
        $set: false
      }
    });
  },
  [actions.clueClear]: (state) => {
    return update(state, {
      list: {
        $set: []
      },
      requesting: {
        $set: false
      }
    });
  },
}, {requesting: false, list: []});

const reducer = combineReducers({
  events: eventsReducer,
  eventDetails: eventDetailsReducer,
  clue: clueReducer,
  clueSuggestions: clueSuggestionsReducer,
  date: calendarReducer
});

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
const containers = {
  eventsSearchViewBarContainer: connect((state) => {
      return {
        clue: state.core.clue
      }
    },
    mapDispatchToProps)(EventsSearchViewBar),
  eventsSearchViewBodyContainer: connect((state) => {
      return {
        clue: state.core.clue,
        clueSuggestions: state.core.clueSuggestions.list,
        requestingClueSuggestions: state.core.clueSuggestions.requesting,
      }
    },
    mapDispatchToProps)(EventsSearchViewBody),
  eventsListContainer: connect((state) => {
      return {
        events: state.core.events.list,
        requestingEvents: state.core.events.requesting,
      }
    },
    mapDispatchToProps)(EventsList),
  eventDetailsViewBodyContainer: connect((state) => {
      return {
        eventDetails: state.core.eventDetails.item,
        requesting: state.core.eventDetails.requesting,
      }
    },
    mapDispatchToProps)(EventDetailsViewBody),
  eventsListViewBodyContainer: connect((state) => {
      return {
        eventDetails: state.core.events.list,
        requesting: state.core.events.requesting,
      }
    },
    mapDispatchToProps)(EventsListViewBody),
  calendarContainer: connect((state) => {
      return {
        date: state.core.date,
      }
    },
    mapDispatchToProps)(Calendar),
  coreRouterContainer: connect((state) => {
      return {
        clue: state.core.clue,
      }
    },
    mapDispatchToProps)(CoreRouter),
};

export default {
  actions: actions,
  reducer: reducer,
  containers: containers,
}
