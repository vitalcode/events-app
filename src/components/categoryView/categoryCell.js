import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, InteractionManager} from "react-native";
import {Actions} from "react-native-router-flux";
import {commonStyles as theme} from "../../utils/commonStyles";

const headerHeight = 65;

export default class CategoryCell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    }
  }

  _onCategorySelected(category) {
    const {onCategorySelected} = this.props;
    InteractionManager.runAfterInteractions(() => {
      onCategorySelected(category);
      Actions.pop();
    })
  }

  render() {
    const {selected} = this.state;
    const {children, alternate, dimensions} = this.props;
    const {width, height} = dimensions;
    return (
      <TouchableOpacity activeOpacity={1}
                        onPress={this._onCategorySelected.bind(this, children)}
                        onPressIn={() => this.setState({selected: true})}
                        onPressOut={() => this.setState({selected: false})}>
        <View
          style={[
            styles.cell,
            alternate && styles.cellOther,
            !alternate && selected && styles.cellSelected,
            alternate && selected && styles.cellOtherSelected,
            {width: width / 3, height: (height - headerHeight) / 4}]}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[
              styles.text,
              (alternate ^ selected) && styles.textSelected,
              {fontSize: 16}]}>
            {children.charAt(0).toUpperCase() + children.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#fff'
  },
  cellSelected: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: theme.sectionBackground
  },
  cellOther: {
    backgroundColor: theme.sectionBackground
  },
  cellOtherSelected: {
    borderWidth: 1,
    borderColor: theme.sectionBackground,
    backgroundColor: '#fff'
  },
  text: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: 'Helvetica-Bold'
  },
  textSelected: {
    color: '#fff'
  }
});