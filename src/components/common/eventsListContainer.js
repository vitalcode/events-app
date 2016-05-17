import React, {
  Component
} from 'react-native'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {
  fetchEvents,
  fetchEventDetails,
  collapseHeader
} from '../../actions/eventsList'
import EventsList from './eventsList'
import EventDetailsContainer from '../eventsDetailsView/eventDetailsViewBodyContainer'
import EventsSearchContainer from '../eventsSearchView/eventsSearchViewBodyContainer'
import CalendarContainer from '../calendarView/calendarContainer'

import {Actions} from 'react-native-router-flux'

class EvensListContainer extends Component {
  render() {
    return (
      <EventsList {...this.props}
        navigateToEventDetailsPage={this.navigateToEventDetailsPage.bind(this)}
        navigateToSearchPage={this.navigateToSearchPage.bind(this)}
        navigateToCalendar={this.navigateToCalendar.bind(this)}
      />
    )
  }

  navigateToEventDetailsPage() {
    Actions.eventsDetails()

    // this.props.navigator.push({
    //   component: EventDetailsContainer,
    //   name: 'Details'
    // });
  }

  navigateToSearchPage() {
    this.props.navigator.push({
      component: EventsSearchContainer,
      name: 'Search'
    });
  }

  navigateToCalendar() {
    Actions.calendarView()

    // this.props.navigator.push({
    //   component: CalendarContainer,
    //   name: 'Calendar'
    // });
  }
}

function mapStateToProps(state) {
  const {eventsList} = state;
  return {
    isLoading: eventsList.isLoading,
    events: eventsList.events
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEvents: bindActionCreators(fetchEvents, dispatch),
    fetchEventDetails: bindActionCreators(fetchEventDetails, dispatch),
    collapseHeader: bindActionCreators(collapseHeader, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EvensListContainer)
