import React, {
  Component,
  Dimensions,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment'

export default class CalendarDay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    }
  }

  render() {
    const day =  this.props.day;
    return (
      <View style={styles.dayWrapper}>
        <TouchableWithoutFeedback
          onPressIn={() => this.setState({selected: true})}
          onPressOut={() => this.setState({selected: false})}
        >
          <View style={[styles.day,
            day.today && day.currentMonth && styles.today,
            this.state.selected && styles.daySelected]}>
            <Text style={[styles.dayText,
              day.weekend && styles.dayTextWeekend,
              day.today && styles.dayTextToday,
              !day.currentMonth && styles.dayTextHidden,
              this.state.selected && styles.dayTextSelected]}>
              {day.number}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dayWrapper: {
    width: 40,
    height: 60,
  },
  day: {
    padding: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderRadius: 100,
  },
  today: {
    backgroundColor: '#ff8000',
    borderColor: '#ff8000',
  },
  dayTextToday: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',

  },
  dayText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',

  },
  daySelected: {
    borderColor: '#ff8000',
  },
  dayTextSelected: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',

  },
  dayTextWeekend: {
    color: '#bbb'
  },
  dayTextHidden: {
    color: '#fff'
  },
});