import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AppNavBar from '../common/appNavBar';
import {Actions} from 'react-native-router-flux';
import Icon from "react-native-vector-icons/MaterialIcons";
import {commonStyles as theme} from "../../utils/commonStyles";
import {capitalise} from '../../utils/stringUtils'

export default class categoryViewBar extends AppNavBar {
  renderBar() {
    const {location} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}
                          onPress={()=>Actions.categorySelector()}>
          <Icon style={styles.filterIcon} name='filter-list'/>
          <Text style={styles.text}>{`${capitalise(location)}`}</Text>
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
  button: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginTop: 2,
    color: '#fff',
    fontSize: 17
  },
  filterIcon: {
    marginHorizontal: 5,
    color: theme.sectionBackground,
    fontSize: 18
  }
});