// import React, {
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   ListView,
//   Component,
//   ActivityIndicatorIOS,
//   InteractionManager,
//   TouchableOpacity,
//   Animated,
//   Picker
// } from 'react-native'
// import _ from 'lodash'
// import moment from 'moment'
// import Icon from 'react-native-vector-icons/MaterialIcons'
// import EventsListContainer from '../containers/EventsListContainer'
//
// export default class EventsList extends Component {
//
//   constructor(props) {
//     super(props);
//     this.props.fetchEvents(); // todo refactor
//     this.state = {
//       dataSource: this._createDataSource()
//     };
//   }
//
//   componentWillReceiveProps(nextProps) {
//     this.setState({
//       dataSource: this._createDataSource()
//     })
//   };
//
//   _createDataSource() {
//     const dataSource = new ListView.DataSource({
//       rowHasChanged: (row1, row2) => row1 !== row2,
//       sectionHeaderHasChanged: (s1, s2) => s1 !== s2
//     });
//     const data = _(this.props.events)
//       .map(event => {
//         event.fromDisplay = moment(event.from).format('dddd, MMMM D');
//         event.that = this;
//         return event;
//       })
//       .groupBy('fromDisplay').value();
//     return dataSource.cloneWithRowsAndSections(data);
//   }
//
//   _showEventDetails(id) {
//     const {fetchEventDetails, navigateToEventDetailsPage} = this.props;
//     InteractionManager.runAfterInteractions(() => {
//       fetchEventDetails(id);
//       navigateToEventDetailsPage();
//     })
//   }
//
//   _showSearchPage() {
//     InteractionManager.runAfterInteractions(() => {
//       this.props.navigateToSearchPage();
//     })
//   }
//
//   _onEndReached() {
//     this.props.fetchEvents()
//   }
//
//   _showDatePicker() {
//     this.props.navigateToCalendar()
//   }
//
//   render() {
//     return (
//       <View style={styles.container}>
//         <ListView
//           dataSource={this.state.dataSource}
//           onEndReached={this._onEndReached.bind(this)}
//           renderSectionHeader={this._renderHeader}
//           renderSeparator={this._renderSeparator}
//           renderFooter={this._renderFooter.bind(this)}
//           renderRow={this._renderRow.bind(this)}
//         />
//       </View>
//     );
//   }
//
//   _renderHeader(sectionData, sectionID) {
//
//     let that = sectionData[0].that;
//
//     return (
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => {
//       that._showDatePicker()
//     }}>
//           <Text style={styles.sectionHeader}>{sectionID}</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//
//   _renderSeparator(sectionID, rowID) {
//     return (
//       <View key={`${sectionID}-${rowID}`} style={styles.separator}/>
//     );
//   }
//
//   _renderRow(event) {
//     return (
//       <TouchableOpacity onPress={this._showEventDetails.bind(this, event.id)}>
//         <View style={styles.card}>
//           <View style={styles.description}>
//             <Text style={styles.title}>{event.title}</Text>
//             <View style={styles.firstRow}>
//               <View style={styles.timeContainer}>
//                 <Icon style={styles.locationIcon} name='location-on' size={13}/>
//                 <Text style={styles.locationText}>Cambridge Science Centre</Text>
//               </View>
//               <View style={styles.timeContainer}>
//                 <Icon style={styles.timeIcon} name='access-time' size={12}/>
//                 <Text style={styles.timeText}>{event.timeRangeDisplay}</Text>
//               </View>
//             </View>
//           </View>
//           <View>
//             {event.image !== '' &&
//             <Image
//               key={event.image}
//               style={styles.avatar}
//               source={{uri: event.image }}
//             />
//             }
//           </View>
//         </View>
//       </TouchableOpacity>
//     )
//   }
//
//   _renderFooter() {
//     return (
//       <View>
//         {this.props.isLoading &&
//         <ActivityIndicatorIOS style={styles.spinner}
//                               animating={true}
//                               size={'large'}/>
//         }
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//
//   datePickerContainer: {
//     flex: 1,
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   datePicker: {
//     alignItems: 'center',
//   },
//
//   datePickerButtonContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   datePickerButton: {
//     padding: 5,
//     borderRadius: 3,
//     borderColor: '#007aff',
//     borderWidth: 1,
//     borderStyle: 'solid',
//     backgroundColor: '#007aff'
//   },
//   dateText: {
//     color: '#fff'
//   },
//
//
//   datePickerGo: {
//     width: 50,
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: '#007aff'
//   },
//   datePickerGoPressed: {
//     backgroundColor: '#fff',
//     borderColor: '#007aff',
//     borderWidth: 1,
//     borderStyle: 'solid',
//
//   },
//   datePickerDoneText: {
//     color: '#fff',
//   },
//   datePickerDoneTextPressed: {
//     color: '#000',
//
//   },
//   header: {
//     backgroundColor: '#ff8000',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     opacity: 1,
//   },
//   sectionHeader: {
//     color: 'white',
//     padding: 5,
//     textAlign: 'center',
//     fontFamily: 'Helvetica',
//     fontSize: 14
//   },
//   separator: {
//     height: 1,
//     marginLeft: 20,
//     backgroundColor: '#ddd'
//   },
//   firstRow: {
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     marginTop: 5
//   },
//   locationIcon: {
//     color: '#666'
//   },
//   locationText: {
//     fontSize: 13,
//     fontFamily: 'Helvetica',
//     flex: 1,
//     flexWrap: 'wrap',
//     color: '#666',
//     marginLeft: 5,
//     marginBottom: 2
//   },
//   timeIcon: {
//     color: '#666'
//   },
//   timeText: {
//     fontSize: 12,
//     fontFamily: 'Arial',
//     flex: 1,
//     flexWrap: 'wrap',
//     color: '#666',
//     marginLeft: 5,
//     marginBottom: 2
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   imagePlaceholder: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 60,
//     height: 60,
//     backgroundColor: '#ddeedd'
//   },
//   imagePlaceholderIcon: {
//     opacity: 0.5
//   },
//   spinner: {
//     margin: 10
//   },
//   card: {
//     flexDirection: 'row'
//   },
//   avatar: {
//     width: 120,
//     height: 120
//   },
//   description: {
//     flex: 1,
//     padding: 10,
//     paddingLeft: 20,
//     flexDirection: 'column'
//   },
//   title: {
//     flex: 1,
//     flexWrap: 'wrap',
//     color: '#000',
//     fontFamily: 'Helvetica-Bold',
//     fontSize: 14
//   },
//   header2: {
//     paddingTop: 20,
//     width: window.width,
//     backgroundColor: '#000', //'#82d595',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     opacity: 0.95,
//   },
//   searchIcon2: {
//     color: 'white',
//     marginLeft: 20,
//     marginRight: 20,
//
//   },
//   sectionHeader2: {
//     color: 'white',
//     marginTop: 6,
//     marginBottom: 6,
//     padding: 5,
//     textAlign: 'center',
//     fontFamily: 'Helvetica',
//     fontSize: 16
//   }
// });
//
