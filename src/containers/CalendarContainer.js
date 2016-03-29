import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {dateSelected} from '../actions/eventsList'
import Calendar from '../components/Calendar';

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
    collapseHeader: eventsList.collapseHeader
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dateSelected: bindActionCreators(dateSelected, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainer)
