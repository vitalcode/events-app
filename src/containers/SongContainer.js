import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import Song from '../components/Song'

class SongContainer extends Component {
  render() {
    return (
      <Song {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const {eventsList} = state;
  return {
    isLoading: eventsList.isLoading,
    events: eventsList.events,
    nextPageUrl: eventsList.nextPageUrl,
    playingSongId: eventsList.eventDetails
  };
}

export default connect(mapStateToProps)(SongContainer)
