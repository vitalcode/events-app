import React from 'react';
import {Animated, Platform} from 'react-native'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions, NavBar} from 'react-native-router-flux'
import BaseNavBar from './components/common/baseNavBar'
import CoreModule from './coreModule'

export default class App extends React.Component {

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action)=> {
      console.log("NAV ACTION:", action);
      return defaultReducer(state, action);
    }
  };

  _navigateToSearchView() {
    this.props.actions.clearSearch();
    Actions.eventsSearch();
  }

  render() {
    const {containers} = CoreModule;
    return <Router createReducer={this.reducerCreate.bind(this)}>
      <Scene key="modal" component={Modal}>
        <Scene key="root">
          <Scene key="eventsListView" title="All Events" type="push"
                 navBar={BaseNavBar}
                 component={containers.eventsListViewBodyContainer}
                 onLeft={this._navigateToSearchView.bind(this)} leftButtonImage="search"
                 onRight={()=>Actions.calendarView()} rightButtonImage="date-range"
          />
          <Scene key="eventsSearch" type="push"
                 navBar={CoreModule.containers.eventsSearchViewBarContainer}
                 component={containers.eventsSearchViewBodyContainer}
                 onRight={()=>Actions.calendarView()} rightButtonImage="date-range"
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

