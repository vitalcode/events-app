import React, {
  Component,
  Dimensions,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment'

export default class Calendar extends Component {

  constructor(props) {
    super(props);
  }

  _removeTime(date) {
    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
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
    const weekDay = moment().startOf('isoweek');
    const endWeek = moment().endOf('isoweek');
    const weekDays = [];
    while (weekDay.isSameOrBefore(endWeek)) {
      weekDays.push(weekDay.format('dd'));
      weekDay.add(1, 'day')
    }

    return (
      <View style={styles.container}>
        <View style={styles.header2}>
          <Icon name="arrow-back" style={styles.searchIcon2} size={25} onPress={() => this.props.navigator.pop()}/>
          <TouchableHighlight style={styles.searchIcon2} onPress={this._onTodayPressButton}>
            <Text style={styles.sectionHeader2}>Today</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.weekHeader}>
          {
            weekDays.map(weekDay =>
              <View style={styles.day}>
                <Text style={styles.weekDayText}>{weekDay}</Text>
              </View>
            )
          }
        </View>
        <ListView
          dataSource={this._createDataSource()}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }

  _onTodayPressButton() {

  }

  _renderRow(month) {
    return (
      <View style={styles.month}>
        <View style={styles.monthTitleContainer}>
          <Text style={styles.monthTitleText}>{month.name}</Text>
        </View>
        {
          month.weeks.map((week) =>
            <View style={styles.week}>
              {
                week.days.map((day) =>
                  <View style={styles.dayWrapper}>
                    <View style={[styles.day, day.today && styles.today]}>
                      <Text style={[styles.dayText,
                        day.weekend && styles.dayTextWeekend,
                        !day.currentMonth && styles.dayTextHidden]}>
                        {day.number}
                      </Text>
                    </View>
                  </View>
                )
              }
            </View>
          )
        }
      </View>)
  }

  _createDataSource() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    const months = this._buildCalendar(moment(), moment().add(1, 'year'));
    return dataSource.cloneWithRows(months);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ff8000'
  },
  weekHeaderText: {
  },
  month: {},
  monthTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  monthTitleText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    marginTop: 5
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    borderStyle: 'solid',
    paddingTop: 10
  },
  dayWrapper: {
    width: 30,
    height: 60,
  },
  day: {
  },
  today: {
    borderColor: '#ff8000',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 30,
  },
  weekDayText: {
    color: 'white',
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 14
  },
  dayText: {
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
  header2: {
    paddingTop: 20,
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
  headerButton: {}
});