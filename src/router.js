import React, { Component } from 'react'
import { Scene, Router, Actions } from 'react-native-router-flux'
import Login from './components/page/Login'
import Menu from './components/page/Menu'
import MyFavorite from './components/page/MyFavorite'
import Mail from './components/page/Mail'
import HotBoard from './components/page/HotBoard'

class RouterComponent extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" headerLayoutPreset="center" hideNavBar>
          <Scene key="auth">
            <Scene
              key="login"
              component={Login}
              connectSocket={this.props.connectSocket}
              title="登入MyPTT"
            />
          </Scene>
          <Scene key="main" tabs={true} tabBarPosition="bottom">
            <Scene key="menu" component={Menu} title="Menu" />
            <Scene key="MyFavorite" component={MyFavorite} title="我的最愛" />
            <Scene key="HotBoard" component={HotBoard} title="熱門看板" />
            <Scene key="Mail" component={Mail} title="私人信件" />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default RouterComponent
