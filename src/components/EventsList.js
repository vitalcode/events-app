import React, {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  Component,
  ActivityIndicatorIOS,
  PanResponder,
  InteractionManager
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class EventsList extends Component {

  componentWillMount() {
    this.props.fetchEvents();
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this)
    });
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    this.props.collapseHeader(gestureState.vy < 0);
  }

  _showEventDetails(id) {
    const {fetchEventDetails, navigateToEventDetailsPage} = this.props;
    InteractionManager.runAfterInteractions(() => {
      fetchEventDetails(id);
      navigateToEventDetailsPage();
    })
  }

  _onEndReached() {
    this.props.fetchEvents()
  }

  _createDataSource() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    const data = _(this.props.events)
      .map(event => {
        event.fromDisplay = moment(event.from).format('dddd, MMMM D');
        return event;
      })
      .groupBy('fromDisplay').value();

    return dataSource.cloneWithRowsAndSections(data);
  }

  render() {
    return (
      <View {...this._panResponder.panHandlers} style={styles.container}>
        <ListView
          dataSource={this._createDataSource()}
          onEndReached={this._onEndReached.bind(this)}
          renderSectionHeader={(sectionData, sectionID) =>
            <Text style={styles.sectionHeader}>{sectionID}</Text>
          }
          renderSeparator={(sectionID, rowID) =>
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
          }
          renderFooter={() =>
            <View>
            {this.props.isLoading &&
              <ActivityIndicatorIOS style={styles.spinner}
              animating={true}
              size={'large'} />
            }
            </View>
          }
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    )
  }

  _renderRow(event) {
    return (
      <TouchableOpacity onPress={this._showEventDetails.bind(this, event.id)}>
        <View style={styles.card}>
          <View>
            {event.image !== '' &&
            <Image
              key={event.image}
              style={styles.avatar}
              source={{uri: event.image }}
            />
            }
            {event.image === '' &&
            <View style={styles.imagePlaceholder}>
              <Icon style={styles.imagePlaceholderIcon} name='camera-alt' size={30} />
            </View>
            }
          </View>
          <View style={styles.description}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.firstRow}>
              <View style={styles.timeContainer}>
                <Icon name='access-time' size={12} />
                <Text style={styles.username}>{event.timeRangeDisplay}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Icon name='location-on' size={12} />
                <Text style={styles.username}>Cambridge Science Centre</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    opacity: 0.95
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  },
  firstRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 5
  },
  username: {
    fontSize: 10,
    flex: 1,
    flexWrap: 'wrap',
    color: '#000',
    marginLeft: 5,
    marginBottom: 2
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#ddeedd'
  },
  imagePlaceholderIcon: {
    opacity: 0.5
  },
  spinner: {
    margin: 10
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginLeft: 10,
    marginRight: 10
  },
  avatar: {
    padding: 10,
    width: 60,
    height: 60
  },
  description: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column'
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#000',
    fontSize: 12
  }
});

