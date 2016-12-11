import React from "react";
import {StyleSheet, Animated, Platform} from "react-native";
import {NavBar} from "react-native-router-flux";
import BaseNavBar from "./baseNavBar";
import BaseNavBarNew from "../../../node_modules/react-native-router-flux/src/NavBar";


export default class AppNavBar extends BaseNavBar {

  constructor(props) {
    super(props);
    this.renderTitle = this.renderTitle.bind(this);
  }

  renderBar() {
    throw 'AppNavBar: renderBar method is not implemented';
  }

  // renderTitle(childState, index: number) {
  //   let title = this.props.getTitle ? this.props.getTitle(childState) : childState.title;
  //   if (title === undefined && childState.component && childState.component.title) {
  //     title = childState.component.title;
  //   }
  //   if (typeof(title) === 'function') {
  //     title = title(childState);
  //   }
  //   return (
  //     <Animated.View
  //       key={childState.key}
  //       style={[
  //         styles.titleWrapper,
  //         this.props.titleWrapperStyle,
  //       ]}
  //     >
  //       <Animated.Text
  //         lineBreakMode="tail"
  //         numberOfLines={1}
  //         {...this.props.titleProps}
  //         style={[
  //           styles.title,
  //           this.props.titleStyle,
  //           this.props.navigationState.titleStyle,
  //           childState.titleStyle,
  //           {
  //             opacity: this.props.position.interpolate({
  //               inputRange: [index - 1, index, index + 1],
  //               outputRange: [0, this.props.titleOpacity, 0],
  //             }),
  //             left: this.props.position.interpolate({
  //               inputRange: [index - 1, index + 1],
  //               outputRange: [200, -200],
  //             }),
  //             right: this.props.position.interpolate({
  //               inputRange: [index - 1, index + 1],
  //               outputRange: [-200, 200],
  //             }),
  //           },
  //         ]}
  //       >
  //         {
  //           this.renderBar()
  //         }
  //       </Animated.Text>
  //     </Animated.View>
  //   );
  // }

  renderTitle(childState, index) {

    // TODO refactor
    // if (childState.name === "eventsListView") {
    //   return (<View></View>);
    // }

    const title = this.props.getTitle ? this.props.getTitle(childState) : childState.title;
    return (
      <Animated.View key={childState.key} style={[
        styles.titleWrapper,
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
        {
          this.renderBar()
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginTop: 10,
    position: 'absolute',
    top: Platform.OS === 'ios' || Platform.Version > 19 ? 20 : 0,
    left: 0,
    right: 0,
  },
});