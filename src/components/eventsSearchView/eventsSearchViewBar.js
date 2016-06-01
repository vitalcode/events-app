import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  InteractionManager,
} from 'react-native'
import AppNavBar from '../common/appNavBar'

export default class EventsSearchViewBar extends AppNavBar {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
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

  renderBar() {
    console.log('this.props.clue', this.props.clue);
    return (
      <View style={styles.searchTextInputContainer}>
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
          <Text style={styles.searchText}>{this.props.clue}</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchTextInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 50,
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
  searchText: {
    paddingLeft: 5,
    color: '#fff',
    fontSize: 17,
  },
});