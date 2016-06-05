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
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  _onClearButtonPress(){
    this.props.actions.clueClear();
    this.setState({text: ''});
  }

  renderBar() {
    const {text} = this.state;
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
        <TouchableOpacity style={[styles.clearButtonContainer]}
                          disabled={!text}
                          onPress={this._onClearButtonPress.bind(this)}>
          <Icon style={[styles.clearButton, {opacity: !text ? 0.4: 1}]} name='clear' size={25}/>
        </TouchableOpacity>
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
  clearButtonContainer: {
    paddingRight: 15,
    paddingLeft: 10
  },
  searchTextInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 50,
    paddingRight: 0,
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
  searchText: {
    marginTop: 2,
    paddingLeft: 5,
    color: '#fff',
    fontSize: 17,
  },
});