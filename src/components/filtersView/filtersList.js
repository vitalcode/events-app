import React, {Component} from "react";
import {StyleSheet, View, Animated, Picker, Text} from "react-native";
import LocationFilter from './locationFilter'
import DateFilter from './dateFilter'
import CategoryFilter from './categoryFilter'
import {commonStyles as theme} from "../../utils/commonStyles";
import FilterSection from './filterSection';

export default class FiltersList extends Component {
  render() {
    return (
      <View style={styles.container}>

        <FilterSection title="WHERE">
          <Text style={[styles.filterItem, styles.filterItemSelected]}>Cambridge</Text>
        </FilterSection>

        <FilterSection title="WHEN">
          <Text style={[styles.filterItem, styles.filterItemSelected]}>10 September 2017</Text>
        </FilterSection>

        <CategoryFilter filterItemStyle={styles.filterItem} filterItemSelectedStyle={styles.filterItemSelected}/>

      </View >
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


