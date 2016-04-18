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
import EventsSearch from '../components/EventsSearch'
import EventDetailsContainer from '../containers/EventDetailsContainer'

class EventsSearchContainer extends Component {
  render() {
    return (
      <EventsSearch {...this.props}
        navigateToEventDetailsPage={this.navigateToEventDetailsPage.bind(this)}
        navigateToSearchPage={this.navigateToSearchPage.bind(this)}
      />
    )
  }

  navigateToEventDetailsPage() {
    this.props.navigator.push({
      component: EventDetailsContainer,
      name: 'Summary'
    });
  }

  navigateToSearchPage() {
    this.props.navigator.push({
      component: EventsSearchContainer,
      name: 'Search'
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

export default connect(mapStateToProps, mapDispatchToProps)(EventsSearchContainer)
