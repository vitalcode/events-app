import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  InteractionManager,
  TouchableOpacity
} from 'react-native'
import AppNavBar from '../common/appNavBar'

export default class EventsSearchViewBar extends AppNavBar {

  constructor(props) {
    super(props);
    this.state = {
      text: props.clue,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({text: nextProps.clue});
  }

  _onSearchClueChange(clue) {
    this.setState({text: clue});
    this.props.actions.clueSuggest(clue);
    // TODO this._fetchSearchSuggestions(clue)
  }

  _onSearchClueSubmit() {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.clueUpdate(this.state.text);
    })
  }

  _onClearButtonPress() {
    this.props.actions.clueClear();
    this.setState({text: ''});
  }

  renderBar() {
    const {text} = this.state;
    return (
      <View style={styles.container}
            onPress={this._onClearButtonPress.bind(this)}>
        {
          !this.props.clue &&
          <TextInput
            style={styles.searchTextInput}
            keyboardType="web-search"
            clearButtonMode="never"
            underlineColorAndroid={'#3a3f41'}
            autoCapitalize="none"
            autoFocus={true}
            autoCorrect={false}
            placeholder="Search event"
            placeholderTextColor={'#ccc'}
            onChangeText={this._onSearchClueChange.bind(this)}
            onSubmitEditing={this._onSearchClueSubmit.bind(this)}
            value={this.state.text}
          />
        }
        {
          !!this.props.clue &&
          <TouchableOpacity onPress={this._onClearButtonPress.bind(this)}>
            <Text style={styles.text}>{this.props.clue}</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  clearButton: {
    width: 23,
    height: 21,
    color: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 50,
    paddingRight: 50,
  },
  noLeftButton: {
    paddingRight: 50,
  },
  searchTextInput: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#222',
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    height: 25,
  },
  text: {
    marginTop: 2,
    paddingLeft: 5,
    color: '#fff',
    fontSize: 17,
  },
});