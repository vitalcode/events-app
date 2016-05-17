import React from 'react';
import {
  StyleSheet,
  Animated,
  Platform,
} from 'react-native'
import {NavBar} from 'react-native-router-flux'
import BaseNavBar from './baseNavBar'


export default class AppNavBar extends BaseNavBar {

  constructor(props) {
    super(props);
    this._renderTitle = this._renderTitle.bind(this);
  }

  renderBar() {
    throw 'AppNavBar: renderBar method is not implemented';
  }

  _renderTitle(childState, index:number) {
    console.log('props', this.props.children)
    const title = this.props.getTitle ? this.props.getTitle(childState) : childState.title;
    return (
      <Animated.View style={[
      styles.titleWrapper,
      {
        opacity: this.props.position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [0, 1, 0],
        }),
        left: this.props.position.interpolate({
          inputRange: [index - 1, index + 1],
          outputRange: [200, -200],
        }),
        right: this.props.position.interpolate({
          inputRange: [index - 1, index + 1],
          outputRange: [-200, 200],
        }),
       },
      ]}>
        {
          this.renderBar()
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginTop: 10,
    color: '#0A0A0A',
    position: 'absolute',
    top: Platform.OS === 'ios' || Platform.Version > 19 ? 20 : 0,
    left: 0,
    right: 0,
  },
});