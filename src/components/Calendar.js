let React = require('react-native')
let {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated
} = React;
import {changePlaylist} from '../actions/eventsList'
import moment from 'moment'

class Calendar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fadeAnim: new Animated.Value(0), // init opacity 0
    };

    this.createDates = this.createDates.bind(this)
    this.onPress = this.onPress.bind(this)

  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    const up = gestureState.vy < 0
    console.log(up ? 'up' : 'down')

    if (up) {
      Animated.timing(          // Uses easing functions
        this.state.fadeAnim,    // The value to drive
        {
          toValue: 0,
          duration: 200,
        },           // Configuration
      ).start();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapseHeader) {
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 0,
          duration: 250,
        },
      ).start();
    } else {
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 40,
          duration: 250,
        },
      ).start();
    }
  }

  // componentDidMount() {
  //   if (nextProps.collapseHeader) {
  //     Animated.timing(
  //       this.state.fadeAnim,
  //       {
  //         toValue: 0,
  //         duration: 200,
  //       },
  //     ).start();
  //   } else {
  //     Animated.timing(
  //       this.state.fadeAnim,
  //       {
  //         toValue: 40,
  //         duration: 200,
  //       },
  //     ).start();
  //   }
  //
  //   // Animated.timing(          // Uses easing functions
  //   //   this.state.fadeAnim,    // The value to drive
  //   //   {
  //   //     toValue: 40,
  //   //     duration: 2000,
  //   //   },           // Configuration
  //   // ).start();                // Don't forget start!
  // }

  // _handleStartShouldSetPanResponder(e, gestureState) {
  //   // const up = gestureState.vy < 0
  //   // console.log(up ? 'up' : 'down')
  //   // Should we become active when the user presses down on the circle?
  //   //return true;
  // }
  //
  // _handleMoveShouldSetPanResponder(e, gestureState) {
  //   const up = gestureState.vy < 0
  //   console.log(up ? 'up' : 'down')
  //
  //   if (up) {
  //     Animated.timing(          // Uses easing functions
  //       this.state.fadeAnim,    // The value to drive
  //       {
  //         toValue: 0,
  //         duration: 200,
  //       },           // Configuration
  //     ).start();
  //   }

    //console.log('_handleMoveShouldSetPanResponder', gestureState)
    // Should we become active when the user moves a touch over the circle?
    //return true;
  //}

  // _handlePanResponderGrant(e, gestureState) {
  //   //this._highlight();
  // }
  //
  // _handlePanResponderMove(e, gestureState) {
  //
  //   console.log('_handlePanResponderMove', gestureState)
  //
  //   // this._circleStyles.style.left = this._previousLeft + gestureState.dx;
  //   // this._circleStyles.style.top = this._previousTop + gestureState.dy;
  //   // this._updatePosition();
  // }
  //
  // _handlePanResponderEnd(e, gestureState) {
  //   // this._unHighlight();
  //   // this._previousLeft += gestureState.dx;
  //   // this._previousTop += gestureState.dy;
  // }


  onPress() {

  }

  createDates() {
    const current = moment().startOf('day')
    const end = current.clone().add(30, 'days')
    const dates = []

    while (end.isAfter(current)) {
      dates.push({
        dayOfMonth: current.date(),
        month: current.format('MMM'),
        dayOfWeek: current.format('ddd'),
      })
      current.add(1, 'day')
    }
    return dates;
  }

  render() {
    const {playlist} = this.props
    return (
      <Animated.View style={{height: this.state.fadeAnim}}>
        <ScrollView
          key={'scrollView'}
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        >
          { this.createDates().map((g, idx) => {
            return (
              <TouchableOpacity key={idx} style={[styles.item, {
                'borderLeftWidth': idx === 0 ? 0 : 1,
                'borderBottomWidth': g === playlist ? 2 : 1,
                'borderBottomColor': g === playlist ? '#a6d2a5' : '#e3e3e3'
              }]} onPress={this.onPress.bind(this, g)}>
                <View>
                  <Text style={[styles.content, styles.dayOfMonth]}>{g.dayOfMonth}</Text>
                  <Text style={[styles.content, styles.dayOfWeek]}>{g.dayOfWeek}</Text>
                </View>
              </TouchableOpacity>

            )
          })}
        </ScrollView>
      </Animated.View>
    )
  }
}

let
  styles = StyleSheet.create({
    container: {
      height: 40,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e3e3e3',
      borderTopWidth: 1,
      borderTopColor: '#e3e3e3'
    },
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 40,
      borderLeftColor: '#e3e3e3'
    },
    content: {
      fontWeight: '400',
      color: '#adadad',
    },
    dayOfMonth: {
      height: 20,
      fontSize: 18,
    },
    dayOfWeek: {
      height: 14,
      marginBottom: 5,
      fontSize: 12,
    }
  })

export
default
Calendar