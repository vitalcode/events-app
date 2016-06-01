import React from 'react';
import {
  Animated,
  Platform
} from 'react-native'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions, NavBar} from 'react-native-router-flux'
import BaseNavBar from './components/common/baseNavBar'
import {container} from './coreModule'

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

          <Scene key="eventsListView" component={container.eventsListViewBodyContainer} title="All Events" type="push"
                 navBar={BaseNavBar}
                 onLeft={()=>Actions.eventsSearch()} leftButtonImage="search"
                 onRight={()=>Actions.eventsDetails()} rightButtonImage="more-horiz"
          />

          <Scene key="eventsSearch" component={container.eventsSearchViewBodyContainer} type="push"
                 navBar={container.eventsSearchViewBarContainer}
                 onRight={()=>Actions.calendarView()} rightButtonImage="clear"
          />

          <Scene key="eventsDetails" component={container.eventDetailsViewBodyContainer} type="push"
                 hideNavBar={true}
                 onRight={()=>Actions.eventsListView()} rightTitle="Right"
          />

          <Scene key="calendarView" component={container.calendarContainer} type="push"
                 navBar={BaseNavBar}
                 onRight={()=>Actions.eventsListView()} rightTitle="Today"
                 initial={false}
          />

        </Scene>
      </Scene>

    </Router>
  }
}

