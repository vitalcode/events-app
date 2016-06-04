import React from 'react';
import {Animated, Platform} from 'react-native'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions, NavBar} from 'react-native-router-flux'
import BaseNavBar from './components/common/baseNavBar'
import CoreModule from './coreModule'

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action)=> {
    console.log("ACTION:", action);
    return defaultReducer(state, action);
  }
};

export default class App extends React.Component {
  render() {
    const {containers} = CoreModule;
    const {actions} = this.props;
    return <Router createReducer={reducerCreate}>
      <Scene key="modal" component={Modal}>
        <Scene key="root">
          <Scene key="eventsListView" title="All Events" type="push"
                 navBar={BaseNavBar}
                 component={containers.eventsListViewBodyContainer}
                 onLeft={()=>Actions.eventsSearch()} leftButtonImage="search"
                 onRight={()=>Actions.eventsDetails()} rightButtonImage="more-horiz"
          />
          <Scene key="eventsSearch" type="push"
                 navBar={CoreModule.containers.eventsSearchViewBarContainer}
                 component={containers.eventsSearchViewBodyContainer}
          />
          <Scene key="eventsDetails" type="push"
                 hideNavBar={true}
                 component={containers.eventDetailsViewBodyContainer}
                 onRight={()=>Actions.eventsListView()} rightTitle="Right"
          />
          <Scene key="calendarView" type="push"
                 navBar={BaseNavBar}
                 component={containers.calendarContainer}
                 onRight={()=>Actions.eventsListView()} rightTitle="Today"
                 initial={false}
          />
        </Scene>
      </Scene>
    </Router>
  }
}

