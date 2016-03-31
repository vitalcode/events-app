import React, {
  Component,
  StyleSheet,
  View,
  Text,
  PropTypes
} from 'react-native'
import CalendarContainer from '../containers/CalendarContainer'
import SearchContainer from '../containers/SearchContainer'
import EventsListContainer from '../containers/EventsListContainer'

class Main extends Component {
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Fill Your Day
        </Text>
        <SearchContainer/>
        <CalendarContainer/>
        <EventsListContainer navigator={this.props.navigator}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 200
  },
  title: {
    fontSize: 16,
    marginTop: 25,
    textAlign: 'center'
  }
});

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  playingSongId: PropTypes.number,
  playlist: PropTypes.string,
  playlists: PropTypes.object.isRequired
};

export default Main
