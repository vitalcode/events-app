let React = require('react-native')
let {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  Component,
  ActivityIndicatorIOS,
  PanResponder
} = React;
import Icon from 'react-native-vector-icons/MaterialIcons'
import InteractionManager from 'InteractionManager'
import ProgressBar from 'ProgressBarAndroid'
import {showEventDescription} from '../actions/player'
import {fetchEventsIfNeeded} from '../actions/eventsList'
import SongContainer from '../containers/SongContainer'
import _ from 'lodash'
import moment from 'moment'

class EventsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: this.createDataSource()
    };

    this.onEndReached = this.onEndReached.bind(this);
    this.showEventDetails = this.showEventDetails.bind(this);
    this.createDataSource = this.createDataSource.bind(this);

    this._handleMoveShouldSetPanResponder = this._handleMoveShouldSetPanResponder.bind(this)
  }


  componentWillMount() {
    this.props.fetchEvents()
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    });
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    const up = gestureState.vy < 0;
    console.log(up ? 'up' : 'down');
    this.props.collapseHeader(up);
  }

  createDataSource() {

    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob.from;
    };
    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob;
    };

    var dataSource = new ListView.DataSource({
      getRowData: getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    // var dataBlob = {};
    // var sectionIDs = [];
    // var rowIDs = [];
    // for (var ii = 0; ii < NUM_SECTIONS; ii++) {
    //   var sectionName = 'Section ' + ii;
    //   sectionIDs.push(sectionName);
    //   dataBlob[sectionName] = sectionName;
    //   rowIDs[ii] = [];
    //
    //   for (var jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
    //     var rowName = 'S' + ii + ', R' + jj;
    //     rowIDs[ii].push(rowName);
    //     dataBlob[rowName] = rowName;
    //   }
    // }
    // return dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
    return dataSource.cloneWithRowsAndSections(this.props.events);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const shouldUpdate =
  //     !shallowEqual(this.props, nextProps) ||
  //     !shallowEqual(this.state, nextState)
  //   return shouldUpdate
  // }


  componentWillReceiveProps(nextProps) {
    // const {dispatch, playlist, playlists} = this.props
    // if (playlist !== nextProps.playlist) {
    //   if (!(nextProps.playlist in playlists) || playlists[nextProps.playlist].items.length === 0) {
    //     dispatch(fetchEventsIfNeeded(nextProps.playlist))
    //   }
    // }
    //this.props.scrollFunc(nextProps.playlist)
  }

  showEventDetails(id) {
    const {fetchEventDetails, showEventDetailsPage} = this.props;
    InteractionManager.runAfterInteractions(() => {
      fetchEventDetails(id);
      showEventDetailsPage();
    })
  }

  onEndReached() {
    console.log('onEndReached');
    this.props.fetchEvents()
    //this.props.dispatch(this.props.scrollFunc())
  }

  render() {
    const {events, isLoading} = this.props;

    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    const data = _(events)
      .map(event => {
        event.fromDisplay = moment(event.from).format('dddd, MMMM D');
        return event;
      })
      .groupBy('fromDisplay').value();

    const dataSource2 = dataSource.cloneWithRowsAndSections(data);


    return (
      <View {...this._panResponder.panHandlers} style={styles.container}>
        { this.state.isLoading &&
        <View style={styles.progressbar}>
          <ProgressBar styleAttr='Small'/>
        </View>
        }
        <ListView
          dataSource={dataSource2}
          onEndReached={this.onEndReached}
          renderSectionHeader={(sectionData, sectionID) =>
            <Text style={styles.sectionHeader}>{sectionID}</Text>
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
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          renderRow={(event) => {
            return (
              <TouchableOpacity onPress={this.showEventDetails.bind(this, event.id)}>
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
          }}
        />
      </View>
    )
  }
}

let styles = StyleSheet.create({
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
      alignItems: 'center',
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
    progressbar: {
      marginTop: 10,
      alignItems: 'center'
    }
    ,
    card: {
      flexDirection: 'row',
      padding: 10,
      marginLeft: 10,
      marginRight: 10
    }
    ,
    avatar: {
      padding: 10,
      width: 60,
      height: 60
    }
    ,
    description: {
      flex: 1,
      marginLeft: 10,
      flexDirection: 'column'
    }
    ,
    title: {
      flex: 1,
      flexWrap: 'wrap',
      color: '#000',
      fontSize: 12
    }
    ,
    countContainer: {
      flexDirection: 'row'
    }
    ,
    count: {
      fontSize: 10
    }
  })
  ;

export default EventsList
