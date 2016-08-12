import React, {
  StyleSheet,
  View,
  ListView,
  Component,
  Dimensions,
  InteractionManager

} from 'react-native'
import CategoryCell from './categoryCell'

const categories = [
  'all',
  'cinema',
  'family',
  'fundraising',
  'museum',
  'music',
  'nightlife',
  'outdoors',
  'sport',
  'wildlife',
  'workshop',
  'theatre'
];

export default class eventsSearchViewBody extends Component {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(categories),
    }
  }

  componentDidMount() {
    this.refs.listView.scrollTo({y: 1});
  }

  render() {
    return (
      <View style={[styles.container]}>
        <ListView ref="listView"
                  contentContainerStyle={styles.list}
                  dataSource={this.state.dataSource}
                  scrollEnabled={false}
                  removeClippedSubviews={false}
                  renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }


  _renderRow(item, sectionId, rowId) {
    const {categoryUpdate} = this.props.actions;
    return (
        <CategoryCell onCategorySelected={categoryUpdate} alternate={rowId % 2}>
          {item}
        </CategoryCell>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 65
  },
  list: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

