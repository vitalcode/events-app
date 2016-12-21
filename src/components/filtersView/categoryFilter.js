import React, {Component} from "react";
import {StyleSheet, Animated, Picker, Text} from "react-native";
import FilterSection from "./filterSection";
import {capitalise} from "../../utils/stringUtils";

const categories = [
  'all',
  'cinema',
  'family',
  'fundraising',
  'museum',
  'music',
  'nightlife',
  'outdoors',
  'sport',
  'wildlife',
  'workshop',
  'theatre'
];

export default class CategoryFilter extends Component {
  render() {
    const {filterItemStyle, filterItemSelectedStyle} = this.props;
    return (
      <FilterSection title="WHAT">
        {
          categories.map(category => (
            <Text key={category} style={[filterItemStyle, styles.categoryItem]}>{capitalise(category)}</Text>
          ))
        }
      </FilterSection>
    );
  }
}

const styles = StyleSheet.create({
  categoryItem: {
    padding: 10
  }
});


