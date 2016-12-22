import React, {Component} from "react"
import {Text, InteractionManager, TouchableOpacity} from "react-native"
import FilterSection from "./filterSection"

export default class DateFilter extends Component {

  _onDateSelected() {
    const {router} = this.props;
    InteractionManager.runAfterInteractions(() => {
      router.calendarView()
    })
  }

  render() {
    const {filterItemStyle, filterItemSelectedStyle, selectedDate} = this.props;
    return (
      <FilterSection title="WHEN">
        <TouchableOpacity onPress={() => this._onDateSelected()}>
          <Text style={[
            filterItemStyle,
            filterItemSelectedStyle
          ]}
          >{selectedDate.format('LL')}</Text>
        </TouchableOpacity>
      </FilterSection>
    );
  }
}
