import React, {Component} from "react";
import {StyleSheet, Animated, Picker, Text, TouchableOpacity, InteractionManager} from "react-native";
import FilterSection from "./filterSection";
import {capitalise} from "../../utils/stringUtils";

const allCategories = 'all';
const categories = [
  allCategories,
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

  _isSelected(category) {
    const {selected} = this.props;
    return selected.indexOf(category) !== -1 || (selected.length === 0 && category === allCategories)
  }

  _onCategorySelected(category) {
    const {actions} = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (category !== allCategories) {
        actions.categoryAdd(category);
      } else {
        actions.categoryReset()
      }
    })
  }

  render() {
    const {filterItemStyle, filterItemSelectedStyle} = this.props;
    return (
      <FilterSection title="WHAT">
        {
          categories.map(category => (
            <TouchableOpacity key={category} onPress={this._onCategorySelected.bind(this, category)}>
              <Text style={[
                filterItemStyle,
                styles.categoryItem,
                this._isSelected(category) && filterItemSelectedStyle
              ]}
              >{capitalise(category)}</Text>
            </TouchableOpacity>
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


