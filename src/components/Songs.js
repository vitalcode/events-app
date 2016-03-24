let React = require('react-native')
let {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ListView,
  TouchableOpacity,
  Component
} = React
import Icon from 'react-native-vector-icons/MaterialIcons'
import shallowEqual from 'react-pure-render/shallowEqual'

import InteractionManager from 'InteractionManager'
import ProgressBar from 'ProgressBarAndroid'
let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

import Toolbar from './Toolbar'
import {playSong} from '../actions/player'
import {fetchEventsIfNeeded} from '../actions/playlists'
import SongContainer from '../containers/SongContainer'

class Songs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isFetchingTail: false
    }

    this.onEndReached = this.onEndReached.bind(this)
    this.playSong = this.playSong.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate =
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    return shouldUpdate
  }

  componentWillMount() {
    const {dispatch, playlist} = this.props
    dispatch(fetchEventsIfNeeded(playlist))
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, playlist, playlists} = this.props
    if (playlist !== nextProps.playlist) {
      if (!(nextProps.playlist in playlists) || playlists[nextProps.playlist].items.length === 0) {
        dispatch(fetchEventsIfNeeded(nextProps.playlist))
      }
    }
  }

  playSong(id) {
    const {dispatch, navigator} = this.props
    InteractionManager.runAfterInteractions(() => {
      dispatch(playSong(id))
      navigator.push({
        component: SongContainer,
        name: 'Song'
      })
    })
  }

  millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
  }

  onEndReached() {
    this.props.dispatch(this.props.scrollFunc())
  }

  render () {
    const {dispatch, playlist, playlists, playingSongId, songs, users, route} = this.props
    const isFetching = playlist in playlists ? playlists[playlist].isFetching : false

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    // let dataSource = playlist in playlists ? ds.cloneWithRows(playlists[playlist].items) : ds.cloneWithRows([])

    let dataSource = songs && songs.length > 0 ? ds.cloneWithRows(songs) : ds.cloneWithRows([])

    return (
      <View style={[styles.container, {
        height: playingSongId ? deviceHeight - 145 : deviceHeight - 70,
      }]}>

        { route.name === 'Main' &&
          <Toolbar dispatch={dispatch} playlist={playlist} />
        }

        { isFetching &&
          <View style={styles.progressbar}>
            <ProgressBar styleAttr='Small' />
          </View>
        }
        <ListView
          dataSource={dataSource}
          onEndReached={this.onEndReached}
          renderRow={(song, sectionId, rowId) => {
            return (
              <TouchableOpacity onPress={this.playSong.bind(this, song.id)}>
                <View style={styles.card}>
                  <View>
                    <Image
                      key={song.image}
                      style={styles.avatar}
                      source={{uri: song.image }}
                    />
                  </View>
                  <View style={styles.description}>
                    <View style={styles.firstRow}>
                      <Text style={styles.username}>username</Text>
                      <Text style={styles.username}>duration</Text>
                    </View>
                    <Text style={styles.title}>{song.description}</Text>
                    <View style={styles.countContainer}>
                      <Icon name='play-arrow' size={14} />
                      <Text style={styles.count}>Count</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    backgroundColor: '#f4f4f4'
  },
  progressbar: {
    marginTop: 10,
    alignItems: 'center'
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC'
  },
  avatar: {
    padding: 10,
    width: 50,
    height: 50
  },
  description: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column'
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  username: {
    fontSize: 10
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#000',
    fontSize: 12
  },
  countContainer: {
    flexDirection: 'row'
  },
  count: {
    fontSize: 10
  }
})

export default Songs
