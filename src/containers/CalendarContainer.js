import React, {Component} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import Calendar from '../components/calendar/Calendar'
import {dateSelected} from '../actions/eventsList'

class CalendarContainer extends Component {
  render() {
    return (
      <Calendar {...this.props}/>
    )
  }
}

function mapStateToProps(state) {
  const {eventsList} = state;
  return {
    isLoading: eventsList.isLoading,
    events: eventsList.events,
    nextPageUrl: eventsList.nextPageUrl,
    eventDetails: eventsList.eventDetails,
    date: eventsList.date
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dateSelected: bindActionCreators(dateSelected, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainer)
