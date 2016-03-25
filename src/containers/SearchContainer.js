import React from 'react-native'
import { connect } from 'react-redux';

let {
  View,
  Component
} = React
import { Provider } from 'react-redux'
import Search from '../components/Search'

class SearchContainer extends Component {
  render() {
    return (
      <Search {...this.props} />
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
    songs: entities.songs,
    users: entities.users
  }
}

export default connect(mapStateToProps)(SearchContainer)
