import React, {Component} from "react"
import {StyleSheet, View, ScrollView, Animated, Picker} from "react-native"
import {commonStyles as theme} from "../../utils/commonStyles"
import CoreModule from "../../coreModule"
import LocationFilter from "./locationFilter"

export default class FiltersList extends Component {
  render() {
    const {CategoryFilterContainer, DateFilterContainer} = CoreModule.containers;
    return (
      <View style={styles.container}>
        <ScrollView>
          <LocationFilter filterItemStyle={styles.filterItem}
                          filterItemSelectedStyle={styles.filterItemSelected}
          />
          <DateFilterContainer filterItemStyle={styles.filterItem}
                               filterItemSelectedStyle={styles.filterItemSelected}
          />
          <CategoryFilterContainer filterItemStyle={styles.filterItem}
                                   filterItemSelectedStyle={styles.filterItemSelected}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 63,
    alignItems: 'stretch',
    backgroundColor: theme.card.listBackground,
  },
  filterItem: {
    color: theme.headerBackground,
    fontSize: 14
  },
  filterItemSelected: {
    color: theme.sectionBackground
  }
});




