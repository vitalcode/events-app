import React, {StyleSheet, View, Text, TouchableOpacity, Component, Dimensions, InteractionManager} from "react-native";
import Orientation from "react-native-orientation";
import {Actions} from "react-native-router-flux";
import {commonStyles as theme} from "../../utils/commonStyles";

const headerHeight = 65;

export default class CategoryCell extends Component {

  constructor(props) {
    super(props);
    var {height, width} = Dimensions.get('window');
    this.state = {
      selected: false,
      height, width
    }
  }

  componentWilldMount() {
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }

  _orientationDidChange(orientation) {
    const {height, width} = Dimensions.get('window');
    switch (orientation) {
      case 'LANDSCAPE':
        this.setState({height: width, width: height});
        break;
      case 'PORTRAIT':
        this.setState({height, width});
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
    const {selected, width, height} = this.state;
    const {children, alternate} = this.props;
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
          <Text style={[
              styles.text,
              (alternate ^ selected) && styles.textSelected,
              {fontSize: width / 3 / 8}]}>
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