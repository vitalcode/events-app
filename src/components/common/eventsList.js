import React, {Component} from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ActivityIndicator,
  InteractionManager,
  TouchableOpacity,
  Animated,
  Picker,
  Dimensions
} from "react-native";
import _ from "lodash";
import moment from "moment";
import {Actions} from "react-native-router-flux";
import {commonStyles as theme} from "../../utils/commonStyles";

// must be less than ~50px due to ScrollView bug (event only fires once)
// https://github.com/facebook/react-native/pull/452
// TODO: expose as a prop when onScroll works properly
var PULLDOWN_DISTANCE = 30; // pixels

export default class EventsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: this._createDataSource(props),
      reloading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this._createDataSource(nextProps)
    })
  };

  _createDataSource(props) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    const data = _(props.events)
      .map(event => {
        event.fromDisplay = moment(event.from).format('dddd, MMMM D');
        event.that = this;
        return event;
      })
      .groupBy('fromDisplay').value();
    return dataSource.cloneWithRowsAndSections(data);
  }

  _showEventDetails(id) {
    const {getEventDetails} = this.props;
    InteractionManager.runAfterInteractions(() => {
      getEventDetails(id);
      Actions.eventsDetails();
    })
  }

  _onEndReached() {
    this.props.getEvents()
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          onEndReached={this._onEndReached.bind(this)}
          renderSectionHeader={this._renderSectionHeader}
          renderFooter={this._renderFooter.bind(this)}
          renderRow={this._renderRow.bind(this)}
          renderHeader={this._renderHeader.bind(this)}
          onScroll={this._handleScroll.bind(this)}
        />
      </View >
    );
  }

  _renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.sectionHeaderView}>
        <Text style={styles.sectionHeaderText}>{sectionID}</Text>
      </View>
    );
  }

  _renderRow(event) {
    return (
      <TouchableOpacity activeOpacity={0.4} onPress={this._showEventDetails.bind(this, event.id)}>
        <View style={styles.event}>
          <View style={styles.timeView}>
            <Text style={styles.timeText}>{event.timeRangeDisplay}</Text>
          </View>
          <View style={styles.infoView}>
            <Text numberOfLines={3} ellipsizeMode="tail" style={styles.titleText}>
              {event.title}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.venueText}>
              {event.venue}
            </Text>
            <Text style={styles.categoryText}>
              {event.category}
            </Text>
          </View>
          {
            event.image !== '' &&
            <Image
              key={event.image}
              style={styles.image}
              source={{uri: event.image}}
            />
          }
        </View>
      </TouchableOpacity>
    )
  }

  _renderFooter() {
    return (
      <View style={styles.footerView}>
        {
          this.props.requestingEvents &&
          <ActivityIndicator style={styles.spinner} animating={true}/>
        }
      </View>
    );
  }

  _renderHeader() {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={{position: 'absolute', top: -35, left: width / 2 - 20}}>
        {this.state.reloading &&
        <ActivityIndicator style={styles.spinner}
                              animating={true}/>
        }
      </View>
    );
  }

  _handleScroll(e) {
    if (e.nativeEvent.contentOffset.y < -PULLDOWN_DISTANCE) {
      this.setState({reloading: true})
    } else {
      if (this.state.reloading) {
        this.props.reloadEvents()
      }
      this.setState({reloading: false})
    }
    this.props.onScroll && this.props.onScroll(e)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  event: {
    marginBottom: 10,
    paddingTop: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.card.borderColor,
    backgroundColor: theme.card.background
  },
  timeView: {
    position: 'absolute',
    top: -7,
    left: 6,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.card.borderColor,
    shadowColor: "#666",
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: theme.card.textColor
  },
  infoView: {
    flex: 1,
    padding: 10,
    paddingTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 120
  },
  titleText: {
    color: theme.card.textTitleColor,
    fontFamily: theme.card.textTitleFamily,
    fontSize: theme.card.textTitleSize
  },
  categoryText: {
    fontSize: 14,
    fontFamily: theme.card.textFamily,
    flexWrap: 'nowrap',
    color: theme.card.textColor
  },
  venueText: {
    fontSize: 12,
    fontFamily: theme.card.textFamily,
    color: theme.card.textColor
  },
  image: {
    width: 120,
    height: 120
  },
  sectionHeaderView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    marginBottom: 10,
    backgroundColor: theme.sectionBackground
  },
  sectionHeaderText: {
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 14,
    color: theme.sectionColor,
  },
  footerView: {
    marginTop: 10
  }
});

