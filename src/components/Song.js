import React from 'react-native'
let {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Image,
  TouchableOpacity
} = React
import Icon from 'react-native-vector-icons/MaterialIcons'

class Song extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {playingSongId, songs, users} = this.props
    const song = playingSongId || {}

    return (
      <View style={styles.container}>
        <Image
          source={{uri: song.image}}
          style={styles.backgroundImage}
        >
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Icon name="expand-more" size={40} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.description}>
            <View style={styles.background}>
              <Text style={styles.username}>username</Text>
            </View>
            <View style={styles.background}>
              <Text style={styles.title}>{song.description}</Text>
            </View>
          </View>
        </Image>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#3a3f41',
    borderTopWidth: 2,
    borderTopColor: '#f50'
  },
  backgroundImage: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
    height: null
  },
  description: {
    flex: 1,
    marginTop: 40,
    flexDirection: 'column'
  },
  back: {
    flex: 1,
    fontSize: 12,
    color: '#E2E2E2',
    margin: 20
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 10,
    padding: 5,
  },
  username: {
    fontSize: 12,
    color: '#E2E2E2'
  },
  title: {
    flexWrap: 'wrap',
    color: '#fff',
    fontSize: 14
  },
  player: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 10,
    padding: 5
  }
})

Song.propTypes = {
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  playingSongId: PropTypes.number,
  playlist: PropTypes.string
}

export default Song
