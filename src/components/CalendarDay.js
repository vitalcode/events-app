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
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import {commonStyles} from '../utils/commonStyles'

export default class CalendarDay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    }
  }

  render() {
    const day = this.props.day;
    return (
      <TouchableWithoutFeedback
        onPressIn={() => day.currentMonth && this.setState({selected: true})}
        onPressOut={() => day.currentMonth && this.setState({selected: false})}>
        <View style={styles.dayWrapper}>
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
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  dayWrapper: {
    flex: 1,
    alignItems: 'center',
    height: 60,
    paddingTop: 5
  },
  day: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 37,
    height: 37,
    padding: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: commonStyles.thirdBackground,
    borderRadius: 100,
  },
  today: {
    borderColor: commonStyles.secondBackground,
  },
  dayTextToday: {
    fontSize: 18,
    color: commonStyles.thirdColor,
    textAlign: 'center'
  },
  dayText: {
    fontSize: 18,
    color: commonStyles.thirdColor,
    textAlign: 'center'
  },
  daySelected: {
    backgroundColor: commonStyles.secondBackground,
    borderColor: commonStyles.secondBackground,
  },
  dayTextSelected: {
    fontSize: 18,
    textAlign: 'center',
    color: commonStyles.secondColor
  },
  dayTextWeekend: {
    color: commonStyles.thirdFaintColor
  },
  dayTextHidden: {
    color: commonStyles.thirdBackground
  },
});