import React, {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  Component,
  ActivityIndicatorIOS,
  PanResponder,
  InteractionManager,
  TextInput
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EventsListContainer from '../containers/EventsListContainer'
import {buildAllEventsUrl, updateTotal} from '../utils/urlUtils'

export default class EventsSearch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      searchMode: true,
      suggestions: []
    };

    this.onSubmitEditing = this.onSubmitEditing.bind(this);
  }

  onSubmitEditing() {
    this._showEventList(this.state.text);
    //this.props.onSubmitEditing(this.state.text);
  }

  _createSearchResultsDataSource() {
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    return dataSource.cloneWithRows(this.state.suggestions);
  }

  _clearSearchText() {
    this.setState({text: '', searchMode: true, suggestions: []});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header2}>
          <Icon name="arrow-back" style={styles.searchIcon2} size={25} onPress={() => this.props.navigator.pop()}/>
          <View style={styles.searchTextInputContainer}>
            { this.state.searchMode &&
            <TextInput
              style={[styles.searchTextInput, this.props.searchTextInputStyle]}
              keyboardType="web-search"
              clearButtonMode="never"
              underlineColorAndroid={'#3a3f41'}
              autoCapitalize="none"
              autoFocus={true}
              autoCorrect={false}
              placeholder="Search event"
              placeholderTextColor={'#ccc'}
              onChangeText={this._onSearchClueChange.bind(this)}
              onSubmitEditing={this.onSubmitEditing}
              value={this.state.text}
            />
            }
            { !this.state.searchMode &&
            <Text style={styles.searchText}>{this.state.text}</Text>
            }
          </View>
          <Icon name="clear" style={styles.searchIcon3} size={25} onPress={this._clearSearchText.bind(this)}/>
        </View>
        <View style={styles.container}>
          { !this.state.searchMode &&
          <EventsListContainer navigator={this.props.navigator}/>
          }
          { this.state.searchMode &&
          <View style={styles.searchContainer}>
            {
              <ListView
                dataSource={this._createSearchResultsDataSource()}
                renderRow={this._renderSearchRow.bind(this)}
                renderFooter={() =>
                    <View>
                    {this.state.isSearching &&
                      <ActivityIndicatorIOS style={styles.spinner}
                      animating={true}
                      size={'small'} />
                    }
                    </View>
                  }
              />
            }
          </View>
          }
        </View>
      </View>
    )
  }


  _onSearchClueChange(clue) {
    this.setState({text: clue});
    this._fetchSearchSuggestions(clue)
  }

  _fetchSearchSuggestions(clue) {
    if (clue) {
      const url = `http://suggestqueries.google.com/complete/search?q=${clue}&client=firefox`;
      this.setState({isSearching: true});
      fetch(url)
        .then(response => response.json())
        .then(json => {
          const suggestions = json[1];
          this.setState({suggestions: suggestions});
          this.setState({isSearching: false});
        })
        .catch(error => console.log(error))
    }
    else {
      this.setState({suggestions: []});
    }
  }

  _renderSearchRow(item) {
    return (
      <TouchableOpacity onPress={this._showEventList.bind(this, item)}>
        <View style={styles.searchRow}>
          <Text tyle={styles.searchRowText}>{item}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _showEventList(clue) {
    InteractionManager.runAfterInteractions(() => {
      this.props.clueSelected(clue);
      this.setState({text: clue, searchMode: false});
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff8000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  sectionHeader: {
    color: 'white',
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 14
  },
  separator: {
    height: 1,
    marginLeft: 20,
    backgroundColor: '#ddd'
  },
  firstRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 5
  },
  locationIcon: {
    color: '#666'
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    flex: 1,
    flexWrap: 'wrap',
    color: '#666',
    marginLeft: 5,
    marginBottom: 2
  },
  timeIcon: {
    color: '#666'
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Arial',
    flex: 1,
    flexWrap: 'wrap',
    color: '#666',
    marginLeft: 5,
    marginBottom: 2
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#ddeedd'
  },
  imagePlaceholderIcon: {
    opacity: 0.5
  },
  spinner: {
    margin: 10
  },
  card: {
    flexDirection: 'row'
  },
  avatar: {
    width: 120,
    height: 120
  },
  description: {
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    flexDirection: 'column'
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    fontSize: 14
  },
  header2: {
    paddingTop: 25,
    paddingBottom: 10,
    width: window.width,
    backgroundColor: '#000', //'#82d595',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.95,
  },
  searchIcon2: {
    color: 'white',
    marginLeft: 20,
    marginRight: 10,

  },
  searchIcon3: {
    color: 'white',
    marginLeft: 10,
    marginRight: 20,

  },
  sectionHeader2: {
    color: 'white',
    marginTop: 6,
    marginBottom: 6,
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 16
  },
  searchTextInputContainer: {
    flex: 1,
  },
  searchTextInput: {
    color: '#fff',
    backgroundColor: '#222',
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    height: 25

  },
  searchText: {
    paddingLeft: 5,
    color: '#fff',
    fontSize: 17
  },
  searchContainer: {
    flex: 1,
    padding: 20,
  },
  searchRow: {
    padding: 10,
  },
  searchRowText: {
    fontFamily: 'Helvetica-Light',
    fontSize: 12
  }
});

