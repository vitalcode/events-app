import React, {Component} from "react";
import {
  Dimensions,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import {commonStyles as theme} from "../../utils/commonStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Actions} from "react-native-router-flux";
import moment from "moment";

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

  _renderFooter() {
    return (
      <View>
        {this.props.requesting &&
        <ActivityIndicator style={styles.spinner}
                              animating={true}
                              size={'large'}/>
        }
      </View>
    );
  }

  render() {
    const {eventDetails} = this.props;
    let event = eventDetails || {};
    event.fromDisplay = moment(event.from).format('dddd, D MMMM');
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
          <View key="description" style={ styles.description }>

            <View style={styles.section }>
              <Text style={[styles.text, styles.titleText]}>{event.title}</Text>
            </View>

            <View style={ styles.section }>
              <Icon style={styles.infoIcon} name='today' size={16}/>
              <Text style={[styles.text, styles.infoText]}>{event.fromDisplay}</Text>
            </View>

            <View style={ styles.section }>
              <Icon style={styles.infoIcon} name='access-time' size={16}/>
              <Text style={[styles.text, styles.infoText]}>{event.timeRangeDisplay}</Text>
            </View>

            <View style={ styles.section }>
              <Icon style={styles.infoIcon} name='location-on' size={16}/>
              <Text style={[styles.text, styles.infoText]}>{event.venue}</Text>
            </View>

            <View style={ styles.sectionSeparator }/>

            <View style={ styles.descriptionView }>
              {
                event.description && event.description.map(item => (
                  <View style={styles.descriptionParagraph}>
                    <Text style={styles.descriptionText}>{item}</Text>
                  </View>
                ))
              }
            </View>

          </View>
        )}
        renderFooter={this._renderFooter.bind(this)}
        renderScrollComponent={props => (
          <ParallaxScrollView
            onScroll={onScroll}
            headerBackgroundColor="#333"
            stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
            parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
            backgroundSpeed={10}
            fadeOutForeground={false}
            renderBackground={() => (
              <View key="background">
                <Image source={{
                  uri: event.image,
                  width: window.width,
                  height: PARALLAX_HEADER_HEIGHT
                }}/>
              </View>
            )}

            renderForeground={() => (
              <View style={styles.foreground}>
                <View key="parallax-header" style={ styles.categoryView }>
                  <View style={styles.categoryTriangle}/>
                  <Text style={styles.categoryText}>{event.category}</Text>
                </View>
              </View>
            )}

            renderFixedHeader={() => (
              <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                <View key="fixed-header" style={styles.fixedSection}>
                  <Icon name="arrow-back" style={styles.backButton} size={25}/>
                </View>
              </TouchableWithoutFeedback>
            )}

            renderStickyHeader={() => (
              <View key="sticky-header" style={styles.stickySection}>
                <TouchableWithoutFeedback onPress={() => this.refs.ListView.scrollTo({x: 0, y: 0})}>
                  <View style={styles.topButtonWrapper}>
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
const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  description: {
    padding: 10
  },
  section: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  sectionSeparator: {
    height: 1,
    marginVertical: 10,
    marginLeft: 22,
    marginRight: 10,
    borderTopWidth: 1,
    borderColor: theme.thirdMoreFaintColor
  },
  text: {
    flex: 1,
    flexWrap: 'wrap'
  },
  titleText: {
    fontSize: 25,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
  },
  infoText: {
    color: '#888',
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'Helvetica'
  },
  foreground: {
    flex: 1,
    borderBottomWidth: 3,
    borderColor: theme.sectionBackground
  },
  categoryTriangle: {
    width: 0,
    height: 0,
    borderBottomWidth: 24,
    borderBottomColor: theme.sectionBackground,
    borderLeftWidth: 24,
    borderLeftColor: 'transparent',
  },
  categoryView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: "absolute",
    bottom: 0,
    right: 0
  },
  categoryText: {
    color: '#fff',
    paddingVertical: 3,
    paddingRight: 10,
    paddingLeft: 5,
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: theme.sectionBackground
  },
  descriptionView: {
    marginBottom: 10
  },
  descriptionParagraph: {
    marginBottom: 15
  },
  descriptionText: {
    color: '#555',
    lineHeight: 30,
    fontSize: 18,
    fontFamily: 'Helvetica-Light'
  },
  infoIcon: {
    marginTop: 1,
    color: theme.sectionBackground
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  topButtonWrapper: {
    padding: 10
  },
  topButton: {
    color: '#fff'
  },
  fixedSection: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    padding: 10
  },
  backButton: {
    color: '#fff'
  }
});
