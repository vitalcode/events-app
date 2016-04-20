import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import EventDetails from '../components/EventDetails'

class EventDetailsContainer extends Component {
  render() {
    return (
      <EventDetails {...this.props} />
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

export default connect(mapStateToProps)(EventDetailsContainer)
