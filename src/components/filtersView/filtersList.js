import React, {Component} from "react"
import {StyleSheet, View, ScrollView, Animated, Picker, Text} from "react-native"
import LocationFilter from './locationFilter'
import DateFilter from './dateFilter'
import {commonStyles as theme} from "../../utils/commonStyles"
import FilterSection from './filterSection'
import CoreModule from '../../coreModule'

export default class FiltersList extends Component {
  render() {
    const {CategoryFilterContainer} = CoreModule.containers;
    return (
      <View style={styles.container}>
        <ScrollView>

          <FilterSection title="WHERE">
            <Text style={[styles.filterItem, styles.filterItemSelected]}>Cambridge</Text>
          </FilterSection>

          <FilterSection title="WHEN">
            <Text style={[styles.filterItem, styles.filterItemSelected]}>10 September 2017</Text>
          </FilterSection>

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
    marginTop: 64,
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


