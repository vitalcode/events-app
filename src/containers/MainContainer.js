import React from 'react-native'
import { connect } from 'react-redux';

let {
  View,
  Component
} = React
import { Provider } from 'react-redux'
import Main from '../components/Main'

class MainContainer extends Component {
  render() {
    return (
      <Main {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const { playlist, playlists, entities, player } = state
  const playingSongId = player.currentSongIndex !== null ? playlists[player.selectedPlaylists[player.selectedPlaylists.length - 1]].items[player.currentSongIndex] : null

  return {
    player,
    playingSongId,
    playlist,
    playlists,
    songs: playlists.entities,
    users: entities.users
  }
}

export default connect(mapStateToProps)(MainContainer)
