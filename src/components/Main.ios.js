import React, {
  Component,
  StyleSheet,
  View,
  PropTypes,
  Dimensions,
  StatusBar
} from 'react-native'
import EventsListViewContainer from '../views/EventsListViewContainer'
import CalendarContainer from '../containers/CalendarContainer'

class Main extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
        <EventsListViewContainer navigator={this.props.navigator}/>
      </View>
    )
  }

  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <StatusBar
  //         backgroundColor="black"
  //         barStyle="light-content"
  //       />
  //       <CalendarContainer navigator={this.props.navigator}/>
  //     </View>
  //   )
  // }
}

const window = Dimensions.get('window');
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
