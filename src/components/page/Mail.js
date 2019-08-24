import React, { PureComponent } from 'react'
import {
  DeviceEventEmitter,
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import MailItem from './MailItem'
import { b2u } from '../../pttJs/string_util'

class Mail extends PureComponent {
  state = {
    loading: false,
    data: [],
    boardNumArray: [],
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('_Mail', lines => {
      this.rowDetail(lines)
    })
  }

  rowDetail(lines) {
    for (const termArray of lines) {
      const numArray = termArray.slice(0, 6)
      let num = numArray.map(x => x.ch)
      num = parseInt(b2u(num.join('')).replace(/[^0-9]/gi, ''))
      if (this.state.boardNumArray.indexOf(num) !== -1) continue
      if (isNaN(num)) return
      this.setState({ boardNumArray: this.state.boardNumArray.concat(num) })

      const signArray = termArray.slice(6, 8)
      const dateArray = termArray.slice(8, 14)
      const senderArray = termArray.slice(15, 30)
      const titleArray = termArray.slice(30, 80)

      const sign = this.getb2u(signArray)
      const date = this.getb2u(dateArray).trim()
      const sender = this.getb2u(senderArray).trim()
      const title = this.getb2u(titleArray).trim()
      this.setState({
        data: this.state.data.concat({
          row: {
            sign: sign,
            date: date,
            sender: sender,
            title: title,
          },
          key: num,
        }),
      })
    }
    this.setState({ loading: true })
    console.log(this.state.data)
  }

  getb2u(termchar) {
    const strArry = termchar.map(x => x.ch)
    const str = b2u(strArry.join(''))
    return str
  }

  _onPressItem({ id, boradName }) {
    // var self = this
    // const sendData = [id.toString(), '\r', '\x1b[C', 'm', '\x1b[4~', '\x1b[4~']
    // for (let [i, v] of sendData.entries()) {
    //   setTimeout(() => {
    //     self.props.connectSocket.sendtest(v)
    //     // if (i === sendData.length - 1) {
    //     //   Actions.childboard({ boardName: boradName })
    //     // }
    //   }, 0.2)
    // }
  }

  renderRow = ({ item }) => {
    return (
      <MailItem
        key={item.index}
        item={item}
        // onPressItem={this._onPressItem.bind(this)}
      />
    )
  }

  render() {
    if (!this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>載入中</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            initialNumToRender={20}
            data={this.state.data}
            keyExtractor={item => item.key.toString()}
            renderItem={this.renderRow.bind(this)}
            onEndReached={() => {
              let self = this
              for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                  self.props.connectSocket.sendtest('\x1b[5~')
                }, 0.2)
              }
            }}
            onEndReachedThreshold={1}
          />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
    // marginTop: 2,
  },
})

export default Mail
