
import React from 'react';
import {
  Animated,
  Platform,
  Text
} from 'react-native'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions, NavBar} from 'react-native-router-flux'

import EventsListViewBodyContainer from './components/eventsListView/eventsListViewBodyContainer'

import EventsSearchViewBodyContainer from './components/eventsSearchView/eventsSearchViewBodyContainer'
import EventsSearchViewBarContainer from './components/eventsSearchView/eventsSearchViewBarContainer'

import EventDetailsViewBodyContainer from './components/eventsDetailsView/eventDetailsViewBodyContainer'

import CalendarContainer from './components/calendarView/calendarContainer'

import BaseNavBar from './components/common/baseNavBar'

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action)=> {
    console.log("ACTION:", action);
    return defaultReducer(state, action);
  }
};

export default class App extends React.Component {


  render() {
    return <Router createReducer={reducerCreate}>

      <Scene key="modal" component={Modal}>
        <Scene key="root">

          <Scene key="eventsListView" component={EventsListViewBodyContainer} title="All Events" type="push"
                 navBar={BaseNavBar}
                 onLeft={()=>Actions.eventsSearch()} leftButtonImage="search"
                 onRight={()=>Actions.eventsDetails()} rightButtonImage="more-horiz"
          />

          <Scene key="eventsSearch" component={EventsSearchViewBodyContainer} type="push"
                 navBar={EventsSearchViewBarContainer}
                 onRight={()=>Actions.calendarView()} rightButtonImage="clear"
          />

          <Scene key="eventsDetails" component={EventDetailsViewBodyContainer} type="push"
                 hideNavBar={true}
                 onRight={()=>Actions.eventsListView()} rightTitle="Right"
          />

          <Scene key="calendarView" component={CalendarContainer} type="push"
                 navBar={BaseNavBar}
                 onRight={()=>Actions.eventsListView()} rightTitle="Today"
                 initial={false}
          />

        </Scene>
      </Scene>

    </Router>
  }
}

