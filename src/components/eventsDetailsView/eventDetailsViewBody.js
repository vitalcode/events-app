import React, {
  Component,
  Dimensions,
  Image,
  ListView,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux'
import moment from 'moment'

export default class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows([
        this.props.eventDetails
      ])
    };
  }

  render() {
    const {eventDetails} = this.props;
    let event = eventDetails || {};
    event.fromDisplay = moment(event.from).format('dddd, D MMMM')
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }).cloneWithRows([
      event
    ]);
    const {
      onScroll = () => {
      }
    } = this.props;
    return (
      <ListView
        ref="ListView"
        style={styles.container}
        dataSource={ dataSource }
        renderRow={(event) => (
          <View key="description" style={ styles.row }>

            <View style={styles.firstRow}>
            <Text style={ styles.title }>
                {event.title}
             </Text>
             <View style={styles.infoContainer}>


                <View style={styles.timeContainer}>
                  <Icon style={styles.timeIcon} name='today' size={16}/>
                  <Text style={styles.timeText}>{event.fromDisplay}</Text>
                </View>

                <View style={styles.timeContainer}>
                  <Icon style={styles.timeIcon} name='access-time' size={16}/>
                  <Text style={styles.timeText}>{event.timeRangeDisplay}</Text>
                </View>

              <View style={styles.timeContainer}>
                  <Icon style={styles.locationIcon} name='location-on' size={16}/>
                  <Text style={styles.locationText}>Cambridge Science Centre</Text>
                </View>

              </View>
              </View>
              <Text style={ styles.rowText }>
                {event.description}
              </Text>
          </View>
         )}
        renderScrollComponent={props => (
          <ParallaxScrollView
            onScroll={onScroll}

            headerBackgroundColor="#333"
            stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
            parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
            backgroundSpeed={10}

            renderBackground={() => (
              <View key="background">
                <Image source={{uri: event.image,
                                width: window.width,
                                height: PARALLAX_HEADER_HEIGHT}}/>
                <View style={{position: 'absolute',
                              top: 0,
                              width: window.width,
                              backgroundColor: 'rgba(0,0,0,.4)',
                              height: PARALLAX_HEADER_HEIGHT}}/>
              </View>
            )}

            // renderForeground={() => (
            //   <View key="parallax-header" style={ styles.parallaxHeader }>
            //     <Text style={ styles.sectionSpeakerText }>
            //       {event.title}
            //     </Text>
            //   </View>
            // )}

            renderFixedHeader={() => (
            <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                <View key="fixed-header" style={styles.fixedSection}>
                <Icon name="arrow-back" style={styles.backButton} size={25}/>
                </View>
              </TouchableWithoutFeedback>
            )}

            renderStickyHeader={() => (
              <View key="sticky-header" style={styles.stickySection}>
              <TouchableWithoutFeedback onPress={() => this.refs.ListView.scrollTo({ x: 0, y: 0 })}>
                <View style={styles.topButtonWraper}>
                  <Icon name="vertical-align-top" style={styles.topButton} size={25}/>
                 </View>
                 </TouchableWithoutFeedback>
              </View>
            )}
            />
        )}
      />
    );
  }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  infoContainer: {
    marginBottom: 10
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  topButtonWraper: {
    padding: 10,
  },
  topButton: {
    color: 'white',
  },
  fixedSection: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    padding: 10,
  },
  backButton: {
    color: 'white',
  },
  parallaxHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 25,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Helvetica',
    padding: 10,
    paddingVertical: 5,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5
  },
  row: {
    justifyContent: 'center',
    padding: 10,
    paddingVertical: 10,
  },
  rowText: {
    lineHeight: 25,
    fontSize: 18,
    fontFamily: 'Helvetica-Light',
  },
  searchIcon2: {
    color: 'white',
    marginLeft: 15,
    marginRight: 15,

  },
  firstRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 5
  },
  locationIcon: {
    color: '#ff8000'
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    flex: 1,
    flexWrap: 'wrap',
    color: '#888',
    marginLeft: 5,
    marginBottom: 2
  },
  timeIcon: {
    color: '#ff8000'
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Arial',
    flex: 1,
    flexWrap: 'wrap',
    color: '#888',
    marginLeft: 5,
    marginBottom: 2
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});
