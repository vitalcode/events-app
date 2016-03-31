import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {fetchEvents, fetchEventDetails, collapseHeader} from '../actions/eventsList'
import EventsList from '../components/EventsList'
import EventDetailsContainer from '../containers/EventDetailsContainer'

class EvensListContainer extends Component {

  render() {
    return (
      <EventsList {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const {eventsList} = state;
  return {
    isLoading: eventsList.isLoading,
    events: eventsList.events,
    nextPageUrl: eventsList.nextPageUrl
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchEvents: bindActionCreators(fetchEvents, dispatch),
    fetchEventDetails: bindActionCreators(fetchEventDetails, dispatch),
    showEventDetailsPage: () => showEventDetailsPage(ownProps.navigator),
    collapseHeader: bindActionCreators(collapseHeader, dispatch)
  }
}


function showEventDetailsPage(navigator) {
  navigator.push({
    component: EventDetailsContainer,
    name: 'Summary'
  });
}


export default connect(mapStateToProps, mapDispatchToProps)(EvensListContainer)
