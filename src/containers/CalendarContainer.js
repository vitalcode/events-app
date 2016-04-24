import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import Calendar from '../components/Calendar'

class CalendarContainer extends Component {
  render() {
    return (
      <Calendar {...this.props} />
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

export default connect(mapStateToProps)(CalendarContainer)
