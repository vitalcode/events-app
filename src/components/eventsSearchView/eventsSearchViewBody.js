import React, {Component} from "react";
import {StyleSheet, View, Text, ListView, TouchableOpacity, ActivityIndicator, InteractionManager} from "react-native";
import EventsList from "../common/eventsList";

export default class eventsSearchViewBody extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      //searchMode: true,
      dataSource: this._createDataSource(props.clueSuggestions)
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newProps.clueSuggestions)
    });
  };

  _createDataSource(clueSuggestions) {
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return dataSource.cloneWithRows(clueSuggestions);
  }

  render() {
    return (
      <View style={styles.container}>
        {
          !!this.props.clue &&
          <EventsList events={this.props.events}
                      requestingEvents={this.props.requestingEvents}
                      getEvents={this.props.actions.searchEventsGet}
                      getEventDetails={this.props.actions.getEventDetails}
                      reloadEvents={this.props.actions.searchEventsReload}/>
        }
        {
          !this.props.clue &&
          <View style={styles.searchContainer}>
            {
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderSearchRow.bind(this)}
                renderFooter={() =>
                  <View>
                    {this.props.requestingClueSuggestions &&
                    <ActivityIndicator style={styles.spinner}
                                       animating={true}
                                       size={'small'}/>
                    }
                  </View>
                }
              />
            }
          </View>
        }
      </View>
    )
  }

  _onSearchClueSubmit(item) {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.clueUpdate(item);
    })
  }

  _renderSearchRow(item) {
    return (
      <TouchableOpacity style={styles.searchRow}
                        onPress={this._onSearchClueSubmit.bind(this, item)}>
        <Text tyle={styles.searchRowText}>{item}</Text>
      </TouchableOpacity>
    )
  }

  _showEventList(clue) {
    InteractionManager.runAfterInteractions(() => {
      //this.props.clueSelected(clue);
      this.setState({text: clue, searchMode: false});
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    backgroundColor: '#fff',
  },
  sectionHeaderView: {
    backgroundColor: '#ff8000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  sectionHeaderText: {
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
  categoryText: {
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
  event: {
    flexDirection: 'row'
  },
  image: {
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
  text: {
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

