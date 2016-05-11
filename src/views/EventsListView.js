import React, {
  StyleSheet,
  View,
  Text,
  Component,
  InteractionManager,
  Animated,
  Picker
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EventsListContainer from '../containers/EventsListContainer'
import {commonStyles} from '../utils/commonStyles'

export default class EventsListView extends Component {

  _showSearchPage() {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigateToSearchPage();
    })
  }

  _showCalendarPage() {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigateToCalendar()
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="search" style={styles.searchIcon} size={25} onPress={this._showSearchPage.bind(this)}/>
          <Text style={styles.sectionHeader}>All Events</Text>
          <Icon name="more-horiz" style={styles.searchIcon} size={25} onPress={this._showCalendarPage.bind(this)}/>
        </View>
        <EventsListContainer navigator={this.props.navigator}/>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingTop: 20,
    backgroundColor: commonStyles.firstBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.95
  },
  searchIcon: {
    color: commonStyles.firstColor,
    marginLeft: 20,
    marginRight: 20

  },
  sectionHeader: {
    color: 'white',
    marginTop: 6,
    marginBottom: 6,
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 16
  }
});


