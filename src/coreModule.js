import {combineReducers, bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {createAction, createReducer} from 'redux-act';
import {createActionAsync} from 'redux-act-async';
import update from 'react/lib/update'
import moment from 'moment';
//import {Config} from './config'
import Config from 'react-native-config'
import {buildAllEventsUrl} from './utils/urlUtils'
import EventsSearchViewBar from './components/eventsSearchView/eventsSearchViewBar'
import EventsSearchViewBody from './components/eventsSearchView/eventsSearchViewBody'
import EventsListViewBody from './components/eventsListView/eventsListViewBody'
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
  return event;
}

const restService = {
  getClueSuggestions(clue) {
    const url = `http://suggestqueries.google.com/complete/search?q=${clue}&client=firefox`;
    return fetch(url).then(response => response.json());
  },
  getEvents(clue, date, total, pageSize, nextPage) {
    const request = buildAllEventsUrl(clue, date, false, total, pageSize, nextPage);
    return request.then(response => response.json());
  },
  getEventDetails(id){
    const url = `http://${Config.host}:${Config.port}/${Config.index}/events/${encodeURIComponent(id)}`;
    console.log('getEventDetails url', url);
    return fetch(url).then(response => response.json());
  }
};

const actions = new function () {
  this.clueSuggest = createActionAsync('CLUE_SUGGEST', restService.getClueSuggestions),
    this.getEventDetails = createActionAsync('GET_EVENT_DETAILS', restService.getEventDetails),

    this.categoryEventsGet = () => (dispatch, getState) => {
      const {date} = getState().core;
      const {total, pageSize, nextPage} = getState().core.categoryEvents;
      if (!total || pageSize * nextPage < total) {
        dispatch(this.categoryEventsNextPage());
        dispatch(this.categoryEventsFetch(null, date, total, pageSize, nextPage));
      }
    },
    this.categoryEventsReload = date => (dispatch) => {
      dispatch(this.categoryEventsReset());
      dispatch(this.categoryEventsGet());
    },
    this.categoryEventsNextPage = createAction('CATEGORY_EVENTS_NEXT_PAGE'),
    this.categoryEventsFetch = createActionAsync('CATEGORY_EVENTS_FETCH', restService.getEvents),
    this.categoryEventsReset = createAction('CATEGORY_EVENTS_RESET'),

    this.searchEventsGet = () => (dispatch, getState) => {
      const {clue, date} = getState().core;
      const {total, pageSize, nextPage} = getState().core.searchEvents;
      if (!total || pageSize * nextPage < total) {
        dispatch(this.searchEventsNextPage());
        dispatch(this.searchEventsFetch(clue, date, total, pageSize, nextPage));
      }
    },
    this.searchEventsReload = date => (dispatch) => {
      dispatch(this.searchEventsReset());
      dispatch(this.searchEventsGet());
    },
    this.clearSearch = () => (dispatch) => {
      dispatch(this.clueClear());
      dispatch(this.searchEventsReset());
    },
    this.searchEventsNextPage = createAction('SEARCH_EVENTS_NEXT_PAGE'),
    this.searchEventsFetch = createActionAsync('SEARCH_EVENTS_FETCH', restService.getEvents),
    this.searchEventsReset = createAction('SEARCH_EVENTS_RESET'),

    this.dateUpdate = (date) => (dispatch) => {
      dispatch(this.dateSet(date));
      dispatch(this.categoryEventsReload());
      dispatch(this.searchEventsReload());
    },
    this.dateSet = createAction('DATE_SET'),

    this.clueUpdate = clue => (dispatch) => {
      dispatch(this.clueSet(clue));
      dispatch(this.searchEventsReload());
    },
    this.clueSet = createAction('CLUE_SET'),
    this.clueClear = createAction('CLUE_CLEAR')
};

const eventsReducer = (getAction, nextPageAction, resetAction) => createReducer({
  [getAction.request]: (state) => {
    return update(state, {
      requesting: {
        $set: true
      }
    });
  },
  [getAction.ok]: (state, payload) => {
    const total = payload.hits.total;
    const events = payload.hits.hits
      .map(hit => {
        const source = hit._source;
        return {
          id: hit._id,
          title: source.title && source.title.length > 0 ? source.title[0] : '',
          description: source.description && source.description.length > 0 ? source.description[0] : '',
          image: source.image && source.image.length > 0 ? source.image[0] : '',
          from: source.from && source.from.length > 0 ? source.from[0] : '',
          to: source.to && source.to.length > 0 ? source.to[0] : '',
          category: source.category && source.category.length > 0 ? source.category[0].charAt(0).toUpperCase() + source.category[0].slice(1) : '',
          venue: source.venue && source.venue.length > 0 ? source.venue[0] : 'TBC' // TODO rethink
        }
      });
    return update(state, {
      requesting: {
        $set: false
      },
      list: {
        $push: eventsToDisplayEvents(events)
      },
      total: {
        $set: total
      },
      // nextPage: {
      //   $set: state.nextPage + 1
      // }
    });
  },
  [getAction.error]: (state) => {
    return update(state, {
      requesting: {
        $set: false
      }
    });
  },
  [nextPageAction]: (state) => {
    return update(state, {
      nextPage: {
        $set: state.nextPage + 1
      }
    });
  },
  [resetAction]: (state) => {
    return update(state, {
      requesting: {
        $set: false
      },
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
      },
      item: {
        $set: null
      }
    });
  },
  [actions.getEventDetails.ok]: (state, payload) => {
    const source = payload._source;
    const event = {
      id: payload._id,
      title: source.title && source.title.length > 0 ? source.title[0] : '',
      description: source.description, //&& source.description.length > 0 ? source.description[0] : '',
      image: source.image && source.image.length > 0 ? source.image[0] : '',
      from: source.from && source.from.length > 0 ? source.from[0] : '',
      to: source.to && source.to.length > 0 ? source.to[0] : '',
      category: source.category && source.category.length > 0 ? source.category[0].charAt(0).toUpperCase() + source.category[0].slice(1) : '',
      venue: source.venue && source.venue.length > 0 ? source.venue[0] : 'Cambridge Science Centre'
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

const calendarReducer = createReducer({
  [actions.dateSet]: (state, payload) => {
    return payload
  }
}, moment(Config.today));

const clueReducer = createReducer({
  [actions.clueSet]: (state, payload) => {
    return payload
  },
  [actions.clueClear]: () => {
    return ''
  },
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
  searchEvents: eventsReducer(actions.searchEventsFetch, actions.searchEventsNextPage, actions.searchEventsReset),
  categoryEvents: eventsReducer(actions.categoryEventsFetch, actions.categoryEventsNextPage, actions.categoryEventsReset),
  eventDetails: eventDetailsReducer,
  clue: clueReducer,
  clueSuggestions: clueSuggestionsReducer,
  date: calendarReducer,
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
        events: state.core.searchEvents.list,
        requestingEvents: state.core.searchEvents.requesting,
      }
    },
    mapDispatchToProps)(EventsSearchViewBody),
  eventDetailsViewBodyContainer: connect((state) => {
      return {
        eventDetails: state.core.eventDetails.item,
        requesting: state.core.eventDetails.requesting,
      }
    },
    mapDispatchToProps)(EventDetailsViewBody),
  eventsListViewBodyContainer: connect((state) => {
      return {
        events: state.core.categoryEvents.list,
        requestingEvents: state.core.categoryEvents.requesting,
      }
    },
    mapDispatchToProps)(EventsListViewBody),
  calendarContainer: connect((state) => {
      return {
        selectedDate: state.core.date,
      }
    },
    mapDispatchToProps)(Calendar),
  coreRouterContainer: connect(null, mapDispatchToProps)(CoreRouter),
};

export default {
  actions: actions,
  reducer: reducer,
  containers: containers,
}
