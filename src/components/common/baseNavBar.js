import React, {
  Platform,
  Animated,
  PixelRatio,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NavigationExperimental,
  StatusBar
} from 'react-native';
import {Actions} from 'react-native-router-flux'
const {
  AnimatedView: NavigationAnimatedView,
  Card: NavigationCard,
  RootContainer: NavigationRootContainer,
  Header: NavigationHeader,
} = NavigationExperimental;
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class BaseNavBar extends React.Component {

  static defaultProps = {
    drawerImage: 'arrow-back',
    backButtonImage: 'arrow-back'
  };

  componentWillMount() {
    const state = this.props.navigationState;
    this._renderRightButton = this._renderRightButton.bind(this);
    this._renderBackButton = this._renderBackButton.bind(this);
    this._renderLeftButton = this._renderLeftButton.bind(this);
    this._renderTitle = this._renderTitle.bind(this);
  }

  render() {
    let state = this.props.navigationState;
    const child = state.children[state.index];
    let selected = state.children[state.index];
    while (selected.hasOwnProperty('children')) {
      state = selected;
      selected = selected.children[selected.index];
    }

    let renderLeftButton = selected.renderLeftButton || selected.component.renderLeftButton || this._renderLeftButton;
    let renderRightButton = selected.renderRightButton || selected.component.renderRightButton || this._renderRightButton;
    let renderBackButton = selected.renderBackButton || selected.component.renderBackButton || this._renderBackButton;
    let renderTitle = selected.renderTitle || selected.component.renderTitle;
    return (
      <View>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
        />
        <Animated.View
          style={[styles.sectionHeaderView, this.props.navigationBarStyle, state.navigationBarStyle, selected.navigationBarStyle]}>
          {renderTitle ? renderTitle(selected) : state.children.map(this._renderTitle, this)}
          {renderBackButton() || renderLeftButton()}
          {renderRightButton()}
        </Animated.View>
      </View>
    );
  }

  _renderBackButton() {
    const state = this.props.navigationState;
    const childState = state.children[state.index];
    let buttonImage = childState.backButtonImage || state.backButtonImage || this.props.backButtonImage;
    let onPress = Actions.pop;

    if (state.index === 0) {
      return null;
    }

    let text = childState.backTitle ? <Text
      style={[styles.barBackButtonText, this.props.backButtonTextStyle, state.backButtonTextStyle, childState.backButtonTextStyle]}>
      {childState.backTitle}
    </Text> : null;

    return (
      <TouchableOpacity testID="backNavButton"
                        style={[styles.backButton, this.props.leftButtonStyle, state.leftButtonStyle, childState.leftButtonStyle]}
                        onPress={onPress}>
        {
          buttonImage &&

          {
            // <Image source={buttonImage} style={[styles.backButtonImage, this.props.leftButtonIconStyle, state.barButtonIconStyle, state.leftButtonIconStyle, childState.leftButtonIconStyle]} />
          }
          &&
          <Icon name={buttonImage}
                style={[styles.backButtonImage, this.props.leftButtonIconStyle, state.barButtonIconStyle, state.leftButtonIconStyle, childState.leftButtonIconStyle]}
                size={25}/>
        }
        {text}
      </TouchableOpacity>
    );
  }

  _renderRightButton() {
    const self = this;
    const state = this.props.navigationState;

    function tryRender(state) {
      if (state.rightButton) {
        const Button = state.rightButton;
        return <Button {...self.props} {...state} key={'rightNavBarBtn'} testID="rightNavButton"
                                                  style={[styles.rightButton, state.rightButtonStyle]}/>;
      }
      if (state.onRight && (state.rightTitle || state.rightButtonImage)) {
        return (

          <TouchableOpacity key={'rightNavBarBtn'} testID="rightNavButton"
                            style={[styles.rightButton, state.rightButtonStyle]}
                            onPress={state.onRight.bind(null, state)}>

            {state.rightTitle &&
            <Text style={[styles.barRightButtonText, state.rightButtonTextStyle]}>{state.rightTitle}</Text>}
            {state.rightButtonImage &&
            <View style={{ flex:1, justifyContent:'center', alignItems:'flex-end' }}>
              <Icon name={state.rightButtonImage} style={[styles.rightButtonIconStyle, state.rightButtonIconStyle]}
                    size={25}/>
            </View >
            }
          </TouchableOpacity>
        );
      }
      if ((!!state.onRight ^ !!(state.rightTitle || state.rightButtonImage))) {
        console.warn('Both onRight and rightTitle/rightButtonImage must be specified for the scene: ' + state.name);
      }
    }

    return tryRender(this.props);
  }

  _renderLeftButton() {
    const self = this;
    const drawer = this.context.drawer;
    const state = this.props.navigationState;

    function tryRender(state) {
      let onPress = state.onLeft;
      let buttonImage = state.leftButtonImage;

      if (state.leftButton) {
        const Button = state.leftButton;
        return <Button {...self.props} {...state} key={'leftNavBarBtn'} testID="leftNavButton"
                                                  style={[styles.leftButton, state.leftButtonStyle]}/>;
      }

      if (!!drawer && typeof drawer.toggle === 'function') {
        buttonImage = state.drawerImage;
        if (buttonImage) {
          onPress = drawer.toggle;
        }
      }

      if (onPress && (state.leftTitle || buttonImage)) {
        return (
          <TouchableOpacity key={'leftNavBarBtn'} testID="leftNavButton"
                            style={[styles.leftButton, state.leftButtonStyle]} onPress={onPress.bind(null, state)}>
            {state.leftTitle &&
            <Text style={[styles.barLeftButtonText, state.leftButtonTextStyle]}>{state.leftTitle}</Text>}
            {buttonImage && <View style={{ flex:1, justifyContent:'center', alignItems:'flex-start' }}>
              <Icon name={buttonImage} style={[styles.leftButtonIconStyle, state.leftButtonIconStyle]}
                    size={25}/></View>}
          </TouchableOpacity>
        );
      }
      if ((!!state.onLeft ^ !!(state.leftTitle || buttonImage))) {
        console.warn('Both onLeft and leftTitle/leftButtonImage must be specified for the scene: ' + state.name);
      }
    }

    return tryRender(this.props);
  }

  _renderTitle(childState:NavigationState, index:number) {

    const title = this.props.getTitle ? this.props.getTitle(childState) : childState.title;
    return (
      <Animated.Text
        key={childState.key}
        style={[
          styles.title, this.props.titleStyle, this.props.navigationState.titleStyle, childState.titleStyle,
          {
            opacity: this.props.position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0, 1, 0],
            }),
            left: this.props.position.interpolate({
              inputRange: [index - 1, index + 1],
              outputRange: [200, -200],
            }),
            right: this.props.position.interpolate({
              inputRange: [index - 1, index + 1],
              outputRange: [-200, 200],
            }),
          },
        ]}>
        {title}
      </Animated.Text>
    );
  }

}


BaseNavBar.contextTypes = {
  drawer: React.PropTypes.object
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 0,
    left: 0,
    right: 0,
  },
  sectionHeaderView: {
    backgroundColor: '#000',
    paddingTop: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 64 : 44,
    right: 0,
    left: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#828287',
    position: 'absolute',
  },
  backButton: {
    height: 37,
    position: 'absolute',
    bottom: 4,
    left: 2,
    padding: 8,
    flexDirection: 'row',
  },
  rightButton: {
    height: 37,
    position: 'absolute',
    bottom: 4,
    right: 2,
    padding: 8,
  },
  rightButtonIconStyle: {
    color: 'white'
  },
  leftButton: {
    height: 37,
    position: 'absolute',
    bottom: 4,
    left: 2,
    padding: 8,
  },
  leftButtonIconStyle: {
    color: 'white'
  },
  barRightButtonText: {
    color: 'white',
    textAlign: 'right',
    fontSize: 17,
  },
  barBackButtonText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 6,
  },
  barLeftButtonText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 17,
  },
  backButtonImage: {
    width: 23,
    height: 21,
    color: 'white'
  },
});
