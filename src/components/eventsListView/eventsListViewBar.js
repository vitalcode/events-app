import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AppNavBar from '../common/appNavBar';
import {Actions} from 'react-native-router-flux';
import {capitalise} from '../../utils/stringUtils'

export default class categoryViewBar extends AppNavBar {
  renderBar() {
    const {category} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>Actions.categorySelector()}>
          <Text style={styles.text}>{`${capitalise(category)} Events`}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    marginTop: 2,
    color: '#fff',
    fontSize: 17
  },
});