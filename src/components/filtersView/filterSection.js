import React, {Component} from "react";
import {StyleSheet, View, Animated, Picker, Text} from "react-native";
import {commonStyles as theme} from "../../utils/commonStyles";

export default class FilterSection extends Component {
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

const styles = StyleSheet.create({
  filterSection: {
    marginHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: theme.separatorColor
  },
  filterTitle: {
    marginBottom: 10,
    fontSize: 18
  }
});