import React, {
  Component,
  Dimensions,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment'
import CalendarDay from './CalendarDay'
import {commonStyles} from '../utils/commonStyles'

export default class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: this._createDataSource(),
      weekDays: this._createWeekDays(),
      selectedDate: moment()
    }
  }

  _createDataSource() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    const months = this._buildCalendar(moment(), moment().add(1, 'year'));
    return dataSource.cloneWithRows(months);
  }

  _createWeekDays() {
    const weekDay = moment().startOf('isoweek');
    const endWeek = moment().endOf('isoweek');
    const weekDays = [];
    while (weekDay.isSameOrBefore(endWeek)) {
      weekDays.push(weekDay.format('dd'));
      weekDay.add(1, 'day')
    }
    return weekDays;
  }

  _buildCalendar(from, to) {
    const months = [];
    const end = to.clone().endOf('month');
    let date = from.clone().startOf('month');

    while (date.isBefore(end)) {
      months.push({
        name: date.format('MMMM'),
        weeks: this._buildMonth(date.clone(), date.month())
      });
      date.add(1, 'month')
    }
    return months;
  }

  _buildMonth(start, month) {
    const weeks = [];
    const end = start.clone().add(1, 'month');
    let date = start.clone().startOf('isoweek');

    while (date.isBefore(end)) {
      weeks.push({
        days: this._buildWeek(date.clone(), month)
      });
      date.add(1, 'week');
    }
    return weeks;
  }

  _buildWeek(date, month) {
    const days = [];
    const end = date.clone().add(1, 'week');

    while (date.isBefore(end)) {
      const day = date.day();
      days.push({
        nameOfWeek: date.format('dd'),
        number: date.date(),
        today: date.isSame(new Date(), 'day'),
        currentMonth: date.month() === month,
        weekend: day === 0 || day == 6,
        date: date
      });
      date.add(1, 'day');
    }
    return days;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <Icon name="arrow-back" style={styles.pageHeaderIcon} size={25} onPress={() => this.props.navigator.pop()}/>
          <TouchableHighlight style={styles.pageHeaderIcon} onPress={() => this.refs.ListView.scrollTo({ x: 0, y: 0 })}>
            <Text style={styles.pageHeaderText}>Today</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.weekHeader}>
          {
            this.state.weekDays.map(weekDay =>
              <View style={styles.weekDay}>
                <Text style={styles.weekDayText}>{weekDay}</Text>
              </View>
            )
          }
        </View>
        <ListView ref="ListView"
                  dataSource={this.state.dataSource}
                  renderRow={(month) => this._renderRow(month)}
        />
      </View>
    );
  }

  _renderRow(month) {
    return (
      <View style={styles.month}>
        <View style={styles.monthTitle}>
          <Text style={styles.monthTitleText}>{month.name}</Text>
        </View>
        {
          month.weeks.map((week) =>
            <View style={styles.week}>
              {
                week.days.map((day) => <CalendarDay day={day}/>)
              }
            </View>
          )
        }
      </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  pageHeader: {
    paddingTop: 20,
    backgroundColor: commonStyles.firstBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.95
  },
  pageHeaderIcon: {
    color: 'white',
    marginLeft: 20,
    marginRight: 20

  },
  pageHeaderText: {
    color: commonStyles.firstColor,
    marginTop: 6,
    marginBottom: 6,
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 16
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: commonStyles.secondBackground
  },
  weekDay: {
    padding: 5
  },
  weekDayText: {
    color: commonStyles.secondColor,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 14
  },
  month: {},
  monthTitle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  monthTitleText: {
    marginBottom: 20,
    marginTop: 5,
    fontFamily: 'Helvetica',
    fontSize: 18,
    color: commonStyles.thirdColor
  },
  week: {
    flexDirection: 'row',
    borderTopColor:  commonStyles.thirdMoreFaintColor,
    borderTopWidth: 1,
    borderStyle: 'solid'
  }
});