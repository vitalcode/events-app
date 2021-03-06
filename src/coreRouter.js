import React from "react"
import {Animated, Platform} from "react-native"
import {
  Scene,
  Reducer,
  Router,
  Switch,
  TabBar,
  Modal,
  Schema,
  Actions,
  NavBar,
  ActionConst
} from "react-native-router-flux"
import BaseNavBar from "./components/common/baseNavBar"
import CoreModule from "./coreModule"
import Config from "react-native-config"
import moment from "moment"
import FiltersList from "./components/filtersView/filtersList"
import InfoViewBody from "./components/infoView/infoViewBody"
import Logger from "./utils/logger";

const logger = Logger('Router');

export default class CoreRouter extends React.Component {

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action)=> {
      logger.info("NAV ACTION:", action);
      return defaultReducer(state, action);
    }
  };

  _navigateToSearchView() {
    this.props.actions.clearSearch();
    Actions.eventsSearch();
  }

  _navigateToListView() {
    this.props.actions.categoryEventsReload();
    Actions.eventsListView();
  }

  _dateReset() {
    this.props.actions.dateUpdate(moment(Config.today));
    Actions.pop();
  }

  render() {
    const {containers} = CoreModule;
    return <Router createReducer={this.reducerCreate.bind(this)}>
      <Scene key="modal" component={Modal}>
        <Scene key="root">
          <Scene key="eventsListView" type={ActionConst.RESET} direction="vertical" initial={true}
                 navBar={containers.eventsListViewBarContainer}
                 component={containers.eventsListViewBodyContainer}
                 onLeft={() => this._navigateToSearchView()} leftButtonImage="search"
                 onRight={()=>Actions.infoView()} rightButtonImage="info-outline"/>
          <Scene key="filterList" type={ActionConst.RESET} direction="vertical"
                 navBar={BaseNavBar}
                 component={FiltersList}
                 onLeft={() => this._navigateToListView()} leftTitle="Done"
          />
          <Scene key="infoView" type={ActionConst.RESET} direction="vertical"
                 navBar={BaseNavBar}
                 component={InfoViewBody}
                 onLeft={() => this._navigateToListView()} leftTitle="Done"
          />
          <Scene key="eventsSearch" type="push"
                 navBar={containers.eventsSearchViewBarContainer}
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
                 onRight={()=> this._dateReset()} rightTitle="Today"
          />
          <Scene key="categorySelector" type="push"
                 navBar={BaseNavBar}
                 component={containers.categoryViewBodyContainer}
          />
        </Scene>
      </Scene>
    </Router>
  }
}
