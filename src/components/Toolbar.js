let React = require('react-native')
let {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} = React

import {changePlaylist} from '../actions/playlists'
import {GENRES} from '../constants/SongConstants'
import moment from 'moment'

class Toolbar extends React.Component {
  constructor(props) {
    super(props)
  }

  onPress(g) {
    const {dispatch} = this.props
    dispatch(changePlaylist(g))
  }

  createDates() {
    const current = moment().startOf('day')
    const end = current.clone().add(30, 'days')
    const dates = []

    while (end.isAfter(current)) {
      dates.push({
        dayOfMonth: current.date(),
        month: current.format('MMM'),
        dayOfWeek: current.format('ddd'),
      })
      current.add(1, 'day')
    }
    return dates;
  }

  render() {
    const {playlist} = this.props
    return (
      <View>
        <ScrollView
          key={'scrollView'}
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        >
          { this.createDates().map((g, idx) => {
            return (
              <TouchableOpacity key={idx} style={[styles.item, {
                'borderLeftWidth': idx === 0 ? 0 : 1,
                'borderBottomWidth': g === playlist ? 2 : 1,
                'borderBottomColor': g === playlist ? '#a6d2a5' : '#e3e3e3'
              }]} onPress={this.onPress.bind(this, g)}>
                <Text style={[styles.content, styles.dayOfMonth]}>{g.dayOfMonth}</Text>
                <Text style={[styles.content, styles.dayOfWeek]}>{g.dayOfWeek}</Text>
              </TouchableOpacity>

            )
          })}
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 40,
    borderLeftColor: '#e3e3e3'
  },
  content: {
    fontWeight: '400',
    color: '#adadad',
  },
  dayOfMonth: {
    height: 20,
    fontSize: 18,
  },
  dayOfWeek: {
    height: 14,
    marginBottom: 5,
    fontSize: 12,
  }
})

export default Toolbar
