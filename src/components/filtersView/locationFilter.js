import React, {Component} from "react";
import {Text, TouchableOpacity} from "react-native";
import FilterSection from "./filterSection";

export default class LocationFilter extends Component {
  render() {
    const {filterItemStyle, filterItemSelectedStyle} = this.props;
    return (
      <FilterSection title="WHERE">
        <TouchableOpacity>
          <Text style={[
            filterItemStyle,
            filterItemSelectedStyle
          ]}
          >Cambridge</Text>
        </TouchableOpacity>
      </FilterSection>
    );
  }
}
