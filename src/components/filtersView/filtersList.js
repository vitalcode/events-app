import React, {Component} from "react";
import {StyleSheet, View, Animated, Picker, Text} from "react-native";
import LocationFilter from './locationFilter'
import DateFilter from './dateFilter'
import CategoryFilter from './categoryFilter'
import {commonStyles as theme} from "../../utils/commonStyles";

class FilterSection extends Component {
  render() {
    const {title} = this.props;
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>{title}</Text>
        {this.props.children}
      </View>
    )
  }
}

export default class FiltersList extends Component {
  render() {
    return (
      <View style={styles.container}>

        <FilterSection title="WHERE">
          <Text>Cambridge</Text>
        </FilterSection>

        <FilterSection title="WHEN">
          <Text>10 September 2017</Text>
        </FilterSection>

        <FilterSection title="WHAT">
          <Text>Family</Text>
        </FilterSection>

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
  filterSection: {
    marginHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.separatorColor
  },
  filterTitle: {
    marginBottom: 10
  }
});


