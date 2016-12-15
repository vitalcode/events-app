import React, {Component} from "react";
import {StyleSheet, View, Animated, Picker, Text} from "react-native";

export default class DateFilter extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Date Filter</Text>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});