// import React, {
//   Component
// } from 'react-native'
// import EventsListView from './EventsListView'
// import EventsSearchContainer from '../containers/EventsSearchContainer'
// import CalendarContainer from '../containers/CalendarContainer'
//
// export default class EventsListViewContainer extends Component {
//   render() {
//     return (
//       <EventsListView {...this.props}
//         navigateToSearchPage={this.navigateToSearchPage.bind(this)}
//         navigateToCalendar={this.navigateToCalendar.bind(this)}
//       />
//     )
//   }
//
//   navigateToCalendar() {
//     this.props.navigator.push({
//       component: CalendarContainer,
//       name: 'Calendar'
//     });
//   }
//
//   navigateToSearchPage() {
//     this.props.navigator.push({
//       component: EventsSearchContainer,
//       name: 'Search'
//     });
//   }
// }
