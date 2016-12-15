import React, {Component} from "react";
import {StyleSheet, View, Animated, Picker, Text} from "react-native";
import LocationFilter from './locationFilter'
import DateFilter from './dateFilter'
import CategoryFilter from './categoryFilter'

export default class FiltersList extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Filters List</Text>
        <LocationFilter/>
        <DateFilter/>
        <CategoryFilter/>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64
  }
});


