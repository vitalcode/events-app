// import MainContainer from './MainContainer'
// import React from 'react';
// import {
//   Animated,
//   Platform
// } from 'react-native'
// import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions, NavBar} from 'react-native-router-flux'
// import EventsSearchViewBar from '../components/eventsSearchView/eventsSearchViewBar'
//
// import EventsListViewBodyContainer from '../components/eventsListView/eventsListViewBodyContainer'
//
//
// const reducerCreate = params => {
//   const defaultReducer = Reducer(params);
//   return (state, action)=> {
//     console.log("ACTION:", action);
//     return defaultReducer(state, action);
//   }
// };
//
// export default class App extends React.Component {
//
//   render() {
//     return <Router createReducer={reducerCreate}>
//
//       <Scene key="modal" component={Modal}>
//         <Scene key="root">
//
//           <Scene key="main" component={EventsListViewBodyContainer} type="push"
//                  title="main" navBar={EventsSearchViewBar}
//                  navigationBarStyle={{backgroundColor:"#000"}}
//                  onRight={()=>Actions.main2()} rightTitle="Right"
//           />
//
//           <Scene key="main2" component={EventsListViewBodyContainer} type="push"
//                  title="main" navBar={EventsSearchViewBar}
//                  navigationBarStyle={{backgroundColor:"red"}}
//           />
//
//           {
//             // <Scene key="loginModal2" component={MainContainer} title="Login2" hideNavBar={false} panHandlers={null}
//             //        onRight={()=>alert("Right button")} rightTitle="Right"
//             //        onLeft={()=>alert("Left button!")} leftTitle={"Left"}
//             //        type="push"
//             //        duration={1}
//             // />
//           }
//
//         </Scene>
//       </Scene>
//
//     </Router>
//   }
// }
//
