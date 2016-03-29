import React, {Component} from 'react-native'
import {connect} from 'react-redux';
import {searchEvents} from '../actions/eventsList'
import Search from '../components/Search'
import {bindActionCreators} from 'redux'

class SearchContainer extends Component {
  render() {
    return (
      <Search {...this.props} />
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

function mapDispatchToProps(dispatch) {
  return {
    onSubmitEditing: bindActionCreators(searchEvents, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
