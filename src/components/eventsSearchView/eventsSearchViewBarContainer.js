import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {clueSelected} from '../../actions/eventsList'
import EventsSearchViewBar from './eventsSearchViewBar'

class eventsSearchViewBarContainer extends Component {
  render() {
    return (
      <EventsSearchViewBar {...this.props}/>
    )
  }
}

function mapStateToProps(state) {
  const {eventsList} = state;
  return {
    clue: eventsList.clue,
    
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clueSelected: bindActionCreators(clueSelected, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(eventsSearchViewBarContainer)
