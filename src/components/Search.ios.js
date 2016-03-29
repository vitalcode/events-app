let React = require('react-native')
let {
  StyleSheet,
  View,
  TextInput
} = React
import Icon from 'react-native-vector-icons/MaterialIcons'

class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      text: ''
    }

    this.onSubmitEditing = this.onSubmitEditing.bind(this)
  }

  onSubmitEditing() {
    this.props.onSubmitEditing(this.state.text);
  }

  render () {
    return (
      <View style={styles.container}>
        <Icon name="search" style={styles.searchIcon} size={20}/>
        <View style={styles.searchTextInputContainer}>
          <TextInput
            style={[styles.searchTextInput, this.props.searchTextInputStyle]}
            placeholderTextColor={'#E2E2E2'}
            underlineColorAndroid={'#3a3f41'}
            autoCapitalize="none"
            utoFocus={true}
            autoCorrect={false}
            clearButtonMode="always"
            placeholder="Search..."
            onChangeText={(text) => this.setState({text})}
            onSubmitEditing={this.onSubmitEditing}
            value={this.state.text}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  searchIcon: {
    width: 20,
    color: '#bbb'
  },
  searchTextInputContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  searchTextInput: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 35

  }
});

export default Search
