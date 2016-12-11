import React, {Component} from "react";
import {StyleSheet, View, Animated, Picker} from "react-native";
import {commonStyles} from "../../utils/commonStyles";
import EventsList from "../common/eventsList";

export default class EventsListViewBody extends Component {
  render() {
    return (
      <View style={styles.container}>
        <EventsList events={this.props.events}
                    requestingEvents={this.props.requestingEvents}
                    getEvents={this.props.actions.categoryEventsGet}
                    getEventDetails={this.props.actions.getEventDetails}
                    reloadEvents={this.props.actions.categoryEventsReload}/>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    backgroundColor: commonStyles.card.listBackground
  },
  sectionHeaderView: {
    paddingTop: 20,
    backgroundColor: commonStyles.headerBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.95
  },
  searchIcon: {
    color: commonStyles.headerColor,
    marginLeft: 20,
    marginRight: 20

  },
  sectionHeaderText: {
    color: 'white',
    marginTop: 6,
    marginBottom: 6,
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 16
  }
});


