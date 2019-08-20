import React, { Component } from 'react'
import { DeviceEventEmitter, View, Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, Input, Button, Spinner } from '../common'
import {
  accountChange,
  passwordChanged,
  loginUser,
} from '../actions/LoginActions'
import { MaterialCommunityIcons } from '@expo/vector-icons'

class Login extends Component {
  state = {
    loading: false,
    loginSuccess: false,
    loginFaild: false,
    loginRepeat: false,
    loginGuestSuccess: false,
    loginGuestFaild: false,
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('Login', result => {
      this.checkLoginState(result)
    })
  }

  checkLoginState(result) {
    this.props.loginUser(result)
  }

  onAccountChange(text) {
    this.props.accountChange(text)
  }

  onPasswordChanged(text) {
    this.props.passwordChanged(text)
  }

  onButtonPress() {
    const { account, password } = this.props
    const data = account + '\r' + password + '\r'
    this.props.connectSocket.sendtest(data)
    this.setState({ loading: true })
  }

  renderButton() {
    if (this.state.loading) {
      if (this.props.loadingEnd) {
        this.setState({ loading: false })
        return <Button onPress={this.onButtonPress.bind(this)}>登入</Button>
      }
      return <Spinner size="large" />
    }

    return <Button onPress={this.onButtonPress.bind(this)}>登入</Button>
  }

  renderError() {
    if (this.props.guestLoginFaild || this.props.loginFaild) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>{this.props.error}</Text>
        </View>
      )
    }
  }

  renderRepeat() {
    if (this.props.loginRepeat) {
      return Alert.alert('提示', '是否刪除重複連線', [
        {
          text: '否',
          onPress: () => {
            this.props.connectSocket.sendtest('n')
            this.props.connectSocket.sendtest('\r')
          },
        },
        {
          text: '是',
          onPress: () => {
            this.props.connectSocket.sendtest('Y')
            this.props.connectSocket.sendtest('\r')
          },
        },
      ])
    }
  }

  render() {
    // console.log(this.props.connectSocket)
    return (
      <Card>
        <CardSection>
          <Input
            label="帳號"
            placeholder="帳號"
            onChangeText={this.onAccountChange.bind(this)}
            value={this.props.account}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label="密碼"
            placeholder="password"
            onChangeText={this.onPasswordChanged.bind(this)}
            value={this.props.password}
          />
        </CardSection>

        {this.renderError()}
        {this.renderRepeat()}

        <CardSection>{this.renderButton()}</CardSection>
      </Card>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
}

const mapStateToProps = ({
  account,
  password,
  error,
  loadingEnd,
  loginSuccess,
  loginFaild,
  guestLoginFaild,
  loginRepeat,
}) => {
  return {
    account,
    password,
    error,
    loadingEnd,
    loginSuccess,
    loginFaild,
    guestLoginFaild,
    loginRepeat,
  }
}

export default connect(
  mapStateToProps,
  { accountChange, passwordChanged, loginUser }
)(Login)
