import React, {
  Component
} from 'react-native'
import {Provider} from 'react-redux';
import configureStore from './store/storeConfig'
import Router from './router'

class Root extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <Router />
      </Provider>
    )
  }
}

export default Root
