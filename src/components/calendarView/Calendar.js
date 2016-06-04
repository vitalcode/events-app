import React, { Component } from 'react';
import {
  Dimensions,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  InteractionManager
} from 'react-native';
import Icon from '../../../node_modules/react-native-vector-icons/MaterialIcons';
import CalendarDay from './calendarDay'
import {commonStyles} from '../../utils/commonStyles'
import {Config} from '../../config'
import {Actions} from 'react-native-router-flux'

export default class Calendar extends Component {

  constructor(props) {
    super(props);
    const today = Config.today;
    this.state = {
      dataSource: this._createDataSource(today),
      weekDays: this._createWeekDays(today),
      selectedDate: today
    }
  }

  _createDataSource(today) {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    const months = this._buildCalendar(today.clone(), today.clone().add(1, 'year'));
    return dataSource.cloneWithRows(months);
  }

  _createWeekDays(today) {
    const weekDay = today.clone().startOf('isoweek');
    const endWeek = today.clone().endOf('isoweek');
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
        weeks: this._buildMonth(from, date.clone(), date.month())
      });
      date.add(1, 'month')
    }
    return months;
  }

  _buildMonth(today, start, month) {
    const weeks = [];
    const end = start.clone().add(1, 'month');
    let date = start.clone().startOf('isoweek');

    while (date.isBefore(end)) {
      weeks.push({
        days: this._buildWeek(today, date.clone(), month)
      });
      date.add(1, 'week');
    }
    return weeks;
  }

  _buildWeek(today, date, month) {
    const days = [];
    const end = date.clone().add(1, 'week');

    while (date.isBefore(end)) {
      const day = date.day();
      days.push({
        nameOfWeek: date.format('dd'),
        number: date.date(),
        today: date.isSame(today, 'day'),
        currentMonth: date.month() === month,
        weekend: day === 0 || day == 6,
        date: date.clone()
      });
      date.add(1, 'day');
    }
    return days;
  }

  _showEventsList(date) {
    InteractionManager.runAfterInteractions(() => {
      Actions.pop();
      this.props.actions.dateUpdate(date);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <Icon name="arrow-back" style={styles.pageHeaderIcon} size={25} onPress={() => this.props.navigator.pop()}/>
          <TouchableHighlight onPress={() => this.refs.ListView.scrollTo({ x: 0, y: 0 })}>
            <Text style={styles.pageHeaderText}>Today</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.weekHeader}>
          {
            this.state.weekDays.map((weekDay, index) =>
              <View key={index} style={styles.weekDay}>
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
          month.weeks.map((week, weekIndex) =>
            <View key={weekIndex} style={styles.week}>
              {
                week.days.map((day, dayIndex) => (
                  <CalendarDay key={dayIndex} day={day} onDateSelected={(date) => this._showEventsList(date)}/>))
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