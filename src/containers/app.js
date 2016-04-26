import React, {
  StyleSheet,
  Navigator,
} from 'react-native';

import MainContainer from './MainContainer'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  renderScene(route, navigator) {
    let Component = route.component;

    return (
      <Component navigator={navigator} route={route}/>
    )
  }

  configureScene(route) {
    switch (route.name) {
      case 'Details':
        return Navigator.SceneConfigs.FloatFromBottomAndroid;
      case 'Search':
      case 'Calendar':
        return Navigator.SceneConfigs.FloatFromRight; //HorizontalSwipeJump;
      default:
        return Navigator.SceneConfigs.FloatFromBottomAndroid;
    }
  }

  render() {
    return (
      <Navigator
        ref='navigator'
        style={styles.navigator}
        configureScene={this.configureScene}
        renderScene={this.renderScene}
        initialRoute={{
          component: MainContainer,
          name: 'Main'
        }}
      />
    )
  }
}

let styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});

export default App
