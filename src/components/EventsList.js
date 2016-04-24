import React, {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  Component,
  ActivityIndicatorIOS,
  PanResponder,
  InteractionManager,
  DatePickerIOS,
  TouchableOpacity,
  Animated,
  ScrollView,
  Picker
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class EventsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      goButtonPressed: false,
      datePickerShown: false,
      fadeAnim: new Animated.Value(0),
      language: 'java'
    }
  }

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

  _showSearchPage() {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigateToSearchPage();
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

    const that = this

    let data = _(this.props.events)
      .map(event => {
        event.fromDisplay = moment(event.from).format('dddd, MMMM D');
        event.that = that
        return event;
      })
      .groupBy('fromDisplay').value();

    //debugger

    //data.that = this;

    //debugger

    return dataSource.cloneWithRowsAndSections(data);
  }

  _showDatePicker() {
    // Animated.timing(          // Uses easing functions
    //   this.state.fadeAnim,    // The value to drive
    //   {toValue: 1}            // Configuration
    // ).start();
    // this.setState({datePickerShown: true});

    this.props.navigateToCalendar()
  }

  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.header2}>
  //         <Icon name="today" style={styles.searchIcon2} size={25} onPress={this._showDatePicker.bind(this)}/>
  //         <Text style={styles.sectionHeader2}>All Events</Text>
  //         <Icon name="search" style={styles.searchIcon2} size={25} onPress={this._showSearchPage.bind(this)}/>
  //       </View>
  //       <View {...this._panResponder.panHandlers} style={styles.container}>
  //         <ListView
  //           dataSource={this._createDataSource()}
  //           onEndReached={this._onEndReached.bind(this)}
  //           renderSectionHeader={this._renderHeader}
  //           renderSeparator={this._renderSeparator}
  //           renderFooter={() =>
  //           <View>
  //           {this.props.isLoading &&
  //             <ActivityIndicatorIOS style={styles.spinner}
  //             animating={true}
  //             size={'large'} />
  //           }
  //           </View>
  //         }
  //           renderRow={this._renderRow.bind(this)}
  //         />
  //       </View>
  //       { this.state.datePickerShown &&
  //       <View style={styles.datePickerWrapper}>
  //         <View sytle={styles.datePickerContainer}>
  //           <DatePickerIOS style={styles.datePicker}
  //                          date={this.state.date}
  //                          mode="date"
  //                          onDateChange={this._onDateChange.bind(this)}
  //           />
  //         </View>
  //         <View style={styles.datePickerButtonContainer}>
  //           <TouchableOpacity
  //             style={[styles.datePickerButton, this.state.goButtonPressed && styles.datePickerGoPressed]}
  //             activeOpacity={1}
  //             onPressIn={() => {this.setState({goButtonPressed: true})}}
  //             onPressOut={() => {this.setState({goButtonPressed: false})}}
  //             onPress={this._onDatePickerTodayPress.bind(this)}>
  //             <Text
  //               style={[styles.dateText, this.state.goButtonPressed && styles.datePickerDoneTextPressed]}>Today</Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             style={[styles.datePickerButton, this.state.goButtonPressed && styles.datePickerGoPressed]}
  //             activeOpacity={1}
  //             onPressIn={() => {this.setState({goButtonPressed: true})}}
  //             onPressOut={() => {this.setState({goButtonPressed: false})}}
  //             onPress={this._onDatePickerGoPress.bind(this)}>
  //             <Text
  //               style={[styles.dateText, this.state.goButtonPressed && styles.datePickerDoneTextPressed]}>Done</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //       }
  //
  //
  //     </View >
  //   );
  // }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header2}>
          <Icon name="search" style={styles.searchIcon2} size={25} onPress={this._showSearchPage.bind(this)}/>
          <Text style={styles.sectionHeader2}>All Events</Text>
          <Icon name="more-horiz" style={styles.searchIcon2} size={25} onPress={this._showDatePicker.bind(this)}/>
        </View>
        <View {...this._panResponder.panHandlers} style={styles.container}>
          <ListView
            dataSource={this._createDataSource()}
            onEndReached={this._onEndReached.bind(this)}
            renderSectionHeader={this._renderHeader}
            renderSeparator={this._renderSeparator}
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
        { this.state.datePickerShown &&
        <View style={styles.datePickerWrapper}>
          <View sytle={styles.datePickerContainer}>
            <Picker
              selectedValue={this.state.date}
              onValueChange={this._onDateChange.bind(this)}>
              {
                this._createDates().map((date) =>
                  <Picker.Item label={date.format('dddd, MMMM D')} value={date}/>
                )
              }
            </Picker>
          </View>
          <View style={styles.datePickerButtonContainer}>
            <TouchableOpacity
              style={[styles.datePickerButton, this.state.goButtonPressed && styles.datePickerGoPressed]}
              activeOpacity={1}
              onPressIn={() => {this.setState({goButtonPressed: true})}}
              onPressOut={() => {this.setState({goButtonPressed: false})}}
              onPress={this._onDatePickerTodayPress.bind(this)}>
              <Text
                style={[styles.dateText, this.state.goButtonPressed && styles.datePickerDoneTextPressed]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerButton, this.state.goButtonPressed && styles.datePickerGoPressed]}
              activeOpacity={1}
              onPressIn={() => {this.setState({goButtonPressed: true})}}
              onPressOut={() => {this.setState({goButtonPressed: false})}}
              onPress={this._onDatePickerGoPress.bind(this)}>
              <Text
                style={[styles.dateText, this.state.goButtonPressed && styles.datePickerDoneTextPressed]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        }
      </View >
    );
  }

  _createDates() {
    const current = moment().startOf('day')
    const end = current.clone().add(30, 'days')
    const dates = []

    while (end.isAfter(current)) {
      dates.push(current.clone())
      current.add(1, 'day')
    }
    return dates;
  }

  _onDatePickerTodayPress() {
    this.setState({date: new Date()})
  }

  _onDatePickerGoPress() {
    this.setState({datePickerShown: false})
  }

  _onDateChange(newDate) {
    console.log(moment(newDate).format('dddd, MMMM D'));
    this.setState({date: moment(newDate)})
  }

  _renderHeader(sectionData, sectionID) {

    let that = sectionData[0].that;

    //debugger


    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
      that._showDatePicker()
    }}>
          <Text style={styles.sectionHeader}>{sectionID}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // onPress={this._showDatePicker.bind(this)}

  _renderSeparator(sectionID, rowID) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator}/>
    );
  }

  _renderRow(event) {
    return (
      <TouchableOpacity onPress={this._showEventDetails.bind(this, event.id)}>
        <View style={styles.card}>
          <View style={styles.description}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.firstRow}>
              <View style={styles.timeContainer}>
                <Icon style={styles.locationIcon} name='location-on' size={13}/>
                <Text style={styles.locationText}>Cambridge Science Centre</Text>
              </View>
              <View style={styles.timeContainer}>
                <Icon style={styles.timeIcon} name='access-time' size={12}/>
                <Text style={styles.timeText}>{event.timeRangeDisplay}</Text>
              </View>
            </View>
          </View>
          <View>
            {event.image !== '' &&
            <Image
              key={event.image}
              style={styles.avatar}
              source={{uri: event.image }}
            />
            }
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
  datePickerWrapper: {
    flexDirection: 'column',
    padding: 10,
    paddingTop: 0,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  datePickerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  datePicker: {
    alignItems: 'center',
  },

  datePickerButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerButton: {
    padding: 5,
    borderRadius: 3,
    borderColor: '#007aff',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#007aff'
  },
  dateText: {
    color: '#fff'
  },


  datePickerGo: {
    width: 50,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007aff'
  },
  datePickerGoPressed: {
    backgroundColor: '#fff',
    borderColor: '#007aff',
    borderWidth: 1,
    borderStyle: 'solid',

  },
  datePickerDoneText: {
    color: '#fff',
  },
  datePickerDoneTextPressed: {
    color: '#000',

  },
  header: {
    backgroundColor: '#ff8000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  sectionHeader: {
    color: 'white',
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 14
  },
  separator: {
    height: 1,
    marginLeft: 20,
    backgroundColor: '#ddd'
  },
  firstRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 5
  },
  locationIcon: {
    color: '#666'
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    flex: 1,
    flexWrap: 'wrap',
    color: '#666',
    marginLeft: 5,
    marginBottom: 2
  },
  timeIcon: {
    color: '#666'
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Arial',
    flex: 1,
    flexWrap: 'wrap',
    color: '#666',
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
    flexDirection: 'row'
  },
  avatar: {
    width: 120,
    height: 120
  },
  description: {
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    flexDirection: 'column'
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    fontSize: 14
  },
  header2: {
    paddingTop: 20,
    width: window.width,
    backgroundColor: '#000', //'#82d595',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.95,
  },
  searchIcon2: {
    color: 'white',
    marginLeft: 20,
    marginRight: 20,

  },
  sectionHeader2: {
    color: 'white',
    marginTop: 6,
    marginBottom: 6,
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 16
  },
  // container: {
  //   flex: 1,
  // },
});

