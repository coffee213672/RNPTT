import React from 'react'
import { AsyncStorage } from 'react-native'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import Router from './src/router'
import reducers from './src/components/reducers/LoginReducers'
import { ConnectSocket } from './src/ConnSocket'
import { loadResources } from './src/pttJs/string_util'

export default class App extends React.Component {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))
    const connectSocket = new ConnectSocket()
    connectSocket.connect()
    loadResources()
    AsyncStorage.removeItem('Login')
    return (
      <Provider store={store}>
        <Router connectSocket={connectSocket} />
      </Provider>
    )
  }
}
