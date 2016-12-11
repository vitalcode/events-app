import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';

export default class DimensionsProvider extends Component {

  _onLayout = event => {
    const layout = event.nativeEvent.layout;
    this.props.actions.setDimensions({width: layout.width, height: layout.height})
  };

  render() {
    return (
      <View style={{flex: 1}} onLayout={this._onLayout}>
        {this.props.children}
      </View>
    )
  }
}
