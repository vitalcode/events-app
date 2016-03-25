import React, {
  Component,
  StyleSheet,
  View,
  Dimensions,
  PropTypes,
  ToolbarAndroid
} from 'react-native'
import {Provider} from 'react-redux'
import InteractionManager from 'InteractionManager'
import {fetchEventsIfNeeded} from '../actions/playlists'
import SearchContainer from '../containers/SearchContainer'
import Songs from './Songs'

const toolbarActions = [
  {title: 'Search', icon: require('../../assets/search100.png'), show: 'always'}
]

class Main extends Component {
  constructor(props) {
    super(props)
    this.onActionSelected = this.onActionSelected.bind(this)
  }

  renderContent() {
    const {playlist} = this.props
    return (
      <Songs
        {...this.props}
        scrollFunc={fetchEventsIfNeeded.bind(null, playlist)}/>
    )
  }

  onActionSelected(position) {
    const {navigator} = this.props
    InteractionManager.runAfterInteractions(() => {
      if (position === 0) {
        navigator.push({
          component: SearchContainer,
          name: 'Search'
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          actions={toolbarActions}
          onActionSelected={this.onActionSelected}
          titleColor='#fff'
          title={'Fill Your Day'}
        />
        {this.renderContent()}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  toolbar: {
    backgroundColor: '#3a3f41',
    height: 50,
  }
})

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  playingSongId: PropTypes.number,
  playlist: PropTypes.string,
  playlists: PropTypes.object.isRequired,
}

export default Main
