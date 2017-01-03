import {combineReducers, bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {createAction, createReducer} from 'redux-act';
import {createActionAsync} from 'redux-act-async';
import update from 'react/lib/update'
import moment from 'moment';
import Config from 'react-native-config'
import {Actions} from "react-native-router-flux"
import {fetchEvents, fetchEventDetails} from './utils/graphService'
import EventsSearchViewBar from './components/eventsSearchView/eventsSearchViewBar'
import EventsSearchViewBody from './components/eventsSearchView/eventsSearchViewBody'
import EventsListViewBody from './components/eventsListView/eventsListViewBody'
import EventsListViewBar from './components/eventsListView/eventsListViewBar'
import EventDetailsViewBody from './components/eventsDetailsView/eventDetailsViewBody'
import CategoryFilter from './components/filtersView/categoryFilter'
import DateFilter from './components/filtersView/dateFilter'
import CategoryViewBody from './components/categoryView/categoryViewBody'
import CategoryCell from './components/categoryView/categoryCell'
import DimensionsProvider from './components/common/dimensionsProvider'
import Calendar from './components/calendarView/calendar'
import CoreRouter from './coreRouter'
import _ from 'lodash'

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
  getEvents(clue, date, category, pageSize, nextPage) {
    return fetchEvents(clue, date, category, pageSize, nextPage);
  },
  getEventDetails(id, token){
    return fetchEventDetails(id, token);
  }
};

const actions = new function () {
  this.clueSuggest = createActionAsync('CLUE_SUGGEST', restService.getClueSuggestions),
    this.getEventDetails = createActionAsync('GET_EVENT_DETAILS', restService.getEventDetails),

    this.categoryEventsGet = () => (dispatch, getState) => {
      const {date, category} = getState().core;
      const {total, pageSize, nextPage} = getState().core.categoryEvents;
      if (_.isUndefined(total) || pageSize * nextPage < total) {
        dispatch(this.categoryEventsNextPage());
        dispatch(this.categoryEventsFetch(null, date, category, pageSize, nextPage));
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
      const {clue, date, category} = getState().core;
      const {total, pageSize, nextPage} = getState().core.searchEvents;
      if (_.isUndefined(total) || pageSize * nextPage < total) {
        dispatch(this.searchEventsNextPage());
        dispatch(this.searchEventsFetch(clue, date, category, pageSize, nextPage));
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
    this.clueClear = createAction('CLUE_CLEAR'),

    this.categoryAdd = createAction('CATEGORY_ADD'),
    this.categoryReset = createAction('CATEGORY_RESET'),
    this.categorySet = createAction('CATEGORY_SET'), // TODO check if used

    this.categoryUpdate = category => (dispatch) => {
      dispatch(this.categorySet(category));
      dispatch(this.categoryEventsReload());
      dispatch(this.searchEventsReload());
    },
    this.setDimensions = createAction('DIMENSIONS_SET')
};

const eventsStateDefault = {requesting: false, list: [], total: undefined, pageSize: 10, nextPage: 0};
const eventsReducer = (getAction, nextPageAction, resetAction) => createReducer({
  [getAction.request]: (state) => {
    return update(state, {
      requesting: {
        $set: true
      }
    });
  },
  [getAction.ok]: (state, payload) => {
    const total = payload.data.events.total;
    const events = payload.data.events.items
      .map(hit => {
        return {
          id: hit.id,
          title: hit.title && hit.title.length > 0 ? hit.title[0] : '',
          description: hit.description && hit.description.length > 0 ? hit.description[0] : '',
          image: hit.image && hit.image.length > 0 ? hit.image[0] : '',
          from: hit.from && hit.from.length > 0 ? hit.from[0] : '',
          to: hit.to && hit.to.length > 0 ? hit.to[0] : '',
          category: hit.category && hit.category.length > 0 ? hit.category[0].charAt(0).toUpperCase() + hit.category[0].slice(1) : '',
          venue: hit.venue && hit.venue.length > 0 ? hit.venue[0] : 'TBC' // TODO rethink
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
      },
      total: {
        $set: state.pageSize * state.nextPage
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
  [resetAction]: (state) => eventsStateDefault
}, eventsStateDefault);

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
    const source = payload.data.event;
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
}, Config.today ? moment(Config.today) : moment().startOf('day'));

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

const categoryReducerDefault = [];
const categoryReducer = createReducer({
  [actions.categorySet]: (state, payload) => payload,
  [actions.categoryAdd]: (state, payload) => {
    const index = state.indexOf(payload);
    if (index === -1) {
      return update(state, {$push: [payload]})
    }
    return update(state, {$splice: [[index, 1]]})
  },
  [actions.categoryReset]: (state, payload) => categoryReducerDefault,
}, categoryReducerDefault);

const dimensionsReducer = createReducer({
  [actions.setDimensions]: (state, payload) => (payload)
}, {});

const reducer = combineReducers({
  searchEvents: eventsReducer(actions.searchEventsFetch, actions.searchEventsNextPage, actions.searchEventsReset),
  categoryEvents: eventsReducer(actions.categoryEventsFetch, actions.categoryEventsNextPage, actions.categoryEventsReset),
  eventDetails: eventDetailsReducer,
  clue: clueReducer,
  clueSuggestions: clueSuggestionsReducer,
  date: calendarReducer,
  category: categoryReducer,
  dimensions: dimensionsReducer
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  router: Actions
});
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
  eventsListViewBarContainer: connect((state) => {
      return {
        category: state.core.category, //todo remove
        location: 'Cambridge' // TODO
      }
    },
    mapDispatchToProps)(EventsListViewBar),
  calendarContainer: connect((state) => {
      return {
        selectedDate: state.core.date,
      }
    },
    mapDispatchToProps)(Calendar),
  coreRouterContainer: connect(null, mapDispatchToProps)(CoreRouter),
  categoryViewBodyContainer: connect(null, mapDispatchToProps)(CategoryViewBody),
  categoryCellContainer: connect((state) => {
    return {
      dimensions: state.core.dimensions
    }
  }, mapDispatchToProps)(CategoryCell),
  CategoryFilterContainer: connect((state) => {
    return {
      selected: state.core.category
    }
  }, mapDispatchToProps)(CategoryFilter),
  DateFilterContainer: connect((state) => {
    return {
      selectedDate: state.core.date,
    }
  }, mapDispatchToProps)(DateFilter),
  dimensionsProviderContainer: connect(null, mapDispatchToProps)(DimensionsProvider)
};

export default {
  actions: actions,
  reducer: reducer,
  containers: containers,
}
