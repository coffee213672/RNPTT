import React, { Component } from 'react'
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux'
import tabIcon from './tabIcon'
import Login from './components/page/Login'
import Menu from './components/page/Menu'
import MyFavorite from './components/page/MyFavorite'
import Mail from './components/page/Mail'
import HotBoard from './components/page/HotBoard'
import BoardList from './components/page/BoardList'
import Article from './components/page/Article'
import detailNavBar from './detailNavBar'

class RouterComponent extends Component {
  onBackPress() {
    switch (Actions.currentScene) {
      case 'boardlist':
        this.props.connectSocket.sendtest('\x1b[4~')
        this.props.connectSocket.sendtest('\x1b[D')
        // this.props.connectSocket.sendtest('\x1b[D')
        Actions.pop()
        return true
      case 'Article':
        this.props.connectSocket.sendtest('\x1b[D')
        Actions.pop()
        return true
      default:
        return false
    }
  }

  render() {
    this.recPage = ''
    return (
      <Router
        backAndroidHandler={this.onBackPress.bind(this)}
        navigationBarStyle={{
          backgroundColor: '#95c967',
        }}
      >
        <Scene key="root" headerLayoutPreset="center" hideNavBar={true}>
          <Scene key="auth">
            <Scene
              key="login"
              component={Login}
              connectSocket={this.props.connectSocket}
              title="登入MyPTT"
              titleStyle={{ color: '#ffffff' }}
            />
          </Scene>
          <Scene
            key="main"
            tabs={true}
            tabBarPosition="bottom"
            tabBarStyle={{ backgroundColor: '#95c967' }}
            type={ActionConst.RESET}
          >
            <Scene
              key="menu"
              connectSocket={this.props.connectSocket}
              onExit={() => {
                console.log(`menu exit ::${Actions.currentScene}`)
                const current = Actions.currentScene
                if (current === '_Mail') {
                  this.props.connectSocket.sendtest('\x1b[D')
                  this.props.connectSocket.sendtest('\x1b[D')
                }
              }}
              onEnter={() => {
                console.log(`recPage: ${this.recPage}`)
                if (this.recPage === '') {
                  this.recPage = Actions.currentScene
                } else {
                  if (this.recPage === '_HotBoard') {
                    this.props.connectSocket.sendtest('\x1b[1~')
                    this.props.connectSocket.sendtest('y')
                    this.recPage = Actions.currentScene
                  }
                  if (this.recPage === '_Mail') {
                    const x = ['c', '\x1b[C', '14', '\r', '\x1b[C']
                    let self = this
                    for (let v of x) {
                      setTimeout(() => {
                        self.props.connectSocket.sendtest(v)
                      }, 0.1)
                    }
                    this.recPage = Actions.currentScene
                  }
                }
              }}
              icon={tabIcon}
              iconName={'heart'}
              component={Menu}
              title="我的最愛"
              titleStyle={{ color: '#ffffff' }}
            />
            <Scene
              key="HotBoard"
              connectSocket={this.props.connectSocket}
              onExit={() => {
                console.log(`HotBoard exit ::${Actions.currentScene}`)
                const current = Actions.currentScene
                if (current === '_Mail') {
                  this.props.connectSocket.sendtest('\x1b[D')
                  this.props.connectSocket.sendtest('\x1b[D')
                }
              }}
              onEnter={() => {
                console.log(`recPage: ${this.recPage}`)
                if (this.recPage === '_menu') {
                  this.props.connectSocket.sendtest('\x1b[1~')
                  this.props.connectSocket.sendtest('y')
                  this.recPage = Actions.currentScene
                }
                if (this.recPage === '_Mail') {
                  const x = ['c', '\x1b[C', '14', '\r', '\x1b[C']
                  let self = this
                  for (let v of x) {
                    setTimeout(() => {
                      self.props.connectSocket.sendtest(v)
                    }, 0.1)
                  }
                  this.recPage = Actions.currentScene
                }
              }}
              component={HotBoard}
              title="熱門看板"
              titleStyle={{ color: '#ffffff' }}
              icon={tabIcon}
              iconName={'fire'}
            />
            <Scene
              key="Mail"
              connectSocket={this.props.connectSocket}
              onExit={() => {
                console.log(`Mail exit ::${Actions.currentScene}`)
                const current = Actions.currentScene
                console.log(current === '_menu')
                console.log(current === '_HotBoard')
                if (current === '_menu' || current === '_HotBoard') {
                  console.log(`Come in Mail exit ::${Actions.currentScene}`)
                  this.props.connectSocket.sendtest('\x1b[D')
                  this.props.connectSocket.sendtest('\x1b[D')
                  this.props.connectSocket.sendtest('\x1b[D')
                }
              }}
              onEnter={() => {
                console.log(`recPage: ${this.recPage}`)
                if (this.recPage === '_menu' || this.recPage === '_HotBoard') {
                  this.props.connectSocket.sendtest('m')
                  this.props.connectSocket.sendtest('\x1b[C')
                  this.props.connectSocket.sendtest('\x1b[C')
                  this.recPage = Actions.currentScene
                }
              }}
              component={Mail}
              title="私人信件"
              titleStyle={{ color: '#ffffff' }}
              icon={tabIcon}
              iconName={'email'}
            />
            <Scene
              key="MyFavorite"
              component={MyFavorite}
              title="設定"
              titleStyle={{ color: '#ffffff' }}
              icon={tabIcon}
              iconName={'settings'}
            />
          </Scene>
          <Scene key="childboard">
            <Scene
              key="boardlist"
              component={BoardList}
              connectSocket={this.props.connectSocket}
              leftTitle="back"
              onLeft={() => {
                this.props.connectSocket.sendtest('\x1b[D')
                Actions.pop()
              }}
              title={this.props.boardName}
              titleStyle={{ color: '#ffffff' }}
            />
            <Scene
              key="Article"
              component={Article}
              connectSocket={this.props.connectSocket}
              // hideNavBar={true}
              navBar={detailNavBar}
              // leftTitle="back"
              // onLeft={() => {
              //   this.props.connectSocket.sendtest('\x1b[D')
              //   Actions.pop()
              // }}
              // title={this.props.boardName}
              // titleStyle={{ color: '#ffffff' }}
            />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default RouterComponent
