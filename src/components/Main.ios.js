import React, {
  Component,
  StyleSheet,
  View,
  PropTypes,
  Dimensions,
  StatusBar
} from 'react-native'
import EventsListContainer from '../containers/EventsListContainer'
import Calendar from '../components/Calendar'

class Main extends Component {
  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <StatusBar
  //         backgroundColor="black"
  //         barStyle="light-content"
  //       />
  //       <EventsListContainer navigator={this.props.navigator}/>
  //     </View>
  //   )
  // }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
        <Calendar navigator={this.props.navigator}/>
      </View>
    )
  }
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
