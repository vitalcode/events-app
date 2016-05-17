import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import EventDetailsViewBody from './eventDetailsViewBody'

class EventDetailsViewBodyContainer extends Component {
  render() {
    return (
      <EventDetailsViewBody {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const {eventsList} = state;
  return {
    isLoading: eventsList.isLoading,
    events: eventsList.events,
    nextPageUrl: eventsList.nextPageUrl,
    eventDetails: eventsList.eventDetails
  };
}

export default connect(mapStateToProps)(EventDetailsViewBodyContainer)
