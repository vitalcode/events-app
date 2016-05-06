import React, {
  Component
} from 'react-native'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {
  fetchEvents,
  fetchEventDetails,
  collapseHeader
} from '../actions/eventsList'
import ListView from '../views/ListView'
import EventDetailsContainer from '../containers/EventDetailsContainer'
import EventsSearchContainer from '../containers/EventsSearchContainer'
import CalendarContainer from '../containers/CalendarContainer'

class EvensListContainer extends Component {
  render() {
    return (
      <ListView {...this.props}
        navigateToEventDetailsPage={this.navigateToEventDetailsPage.bind(this)}
        navigateToSearchPage={this.navigateToSearchPage.bind(this)}
        navigateToCalendar={this.navigateToCalendar.bind(this)}
      />
    )
  }

  navigateToEventDetailsPage() {
    this.props.navigator.push({
      component: EventDetailsContainer,
      name: 'Details'
    });
  }

  navigateToSearchPage() {
    this.props.navigator.push({
      component: EventsSearchContainer,
      name: 'Search'
    });
  }

  navigateToCalendar() {
    this.props.navigator.push({
      component: CalendarContainer,
      name: 'Calendar'
    });
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
