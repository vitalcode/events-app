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
import EventsList from '../components/EventsList'
import EventDetailsContainer from '../containers/EventDetailsContainer'

class EvensListContainer extends Component {
  render() {
    return (
      <EventsList {...this.props}
        navigateToEventDetailsPage={this.navigateToEventDetailsPage.bind(this)}/>
    )
  }

  navigateToEventDetailsPage() {
    this.props.navigator.push({
      component: EventDetailsContainer,
      name: 'Summary'
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
