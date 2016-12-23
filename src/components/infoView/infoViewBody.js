import React, {Component} from "react";
import {StyleSheet, View, Text, Animated, Picker} from "react-native";
import {commonStyles as theme} from "../../utils/commonStyles";

export default class infoViewBody extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Vital Code, is the best</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 63,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: theme.card.listBackground,
  },
  text: {
    textAlign: 'center'
  }
});




