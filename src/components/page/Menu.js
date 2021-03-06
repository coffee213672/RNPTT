import React, { PureComponent } from 'react'
import {
  DeviceEventEmitter,
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import ListItem from './ListItem'
import { b2u } from '../../pttJs/string_util'

class Menu extends PureComponent {
  state = {
    loading: false,
    data: [],
    boardNumArray: [],
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('_menu', lines => {
      this.rowDetail(lines)
    })
  }

  rowDetail(lines) {
    for (const [ind1x, termArray] of lines.entries()) {
      const numArray = termArray.slice(0, 8)
      let num = numArray.map(x => x.ch)
      num = parseInt(b2u(num.join('')).replace(/[^0-9]/gi, ''))
      if (this.state.boardNumArray.indexOf(num) !== -1) return
      if (isNaN(num)) return
      this.setState({ boardNumArray: this.state.boardNumArray.concat(num) })

      const boradNameArray = termArray.slice(8, 23)
      const categoryArray = termArray.slice(23, 28)
      const narrationArray = termArray.slice(28, 64)
      const popularityArray = termArray.slice(64, 67)

      const category = this.getb2u(categoryArray, ind1x, 'category')
      const boradName = this.getb2u(boradNameArray, ind1x, 'boradName')
      const narration = this.getb2u(narrationArray, ind1x, 'narration')
      const popularity = this.getb2u(popularityArray, ind1x, 'popularity')
      this.setState({
        data: this.state.data.concat({
          row: {
            boradName: boradName,
            category: category,
            narration: narration,
            popularity: popularity,
          },
          key: num,
        }),
      })
    }
    this.setState({ loading: true })
  }

  getb2u(termchar, index, part) {
    const strArry = termchar.map(x => x.ch)
    let str = b2u(strArry.join(''))
    switch (part) {
      case 'narration':
        str = str.replace(/[\[|\]|\?]/g, '')
        return str
      case 'boradName':
        return this.getBoardName(termchar[4], str.trim(), index)
      default:
        const strLocation = termchar.map(x => x)
        return this.getColorToString(strLocation, str.trim(), part)
    }
  }

  getBoardName(termcharX, str, index) {
    const colorState = termcharX.getColor()
    const colorArray = [`q${colorState.fg}`, `b${colorState.bg}`]

    switch (true) {
      case str.indexOf('ˇ') !== -1:
        str = str.substring(1)
        return {
          key: `${str}_${index}`,
          styleStr: ['q15', 'b0'],
          text: str,
          tick: true,
        }
      case colorArray.indexOf('q7') !== -1:
        return {
          key: `${str}_${index}`,
          styleStr: colorArray,
          text: str,
          tick: true,
        }
      default:
        return {
          key: `${str}_${index}`,
          styleStr: ['q15', 'b0'],
          text: str,
          tick: false,
        }
    }
  }

  getColorToString(termArray, str, part) {
    let colorArray = []

    for (let x of termArray) {
      if (x.ch === ' ') continue
      const colorState = x.getColor()
      colorArray[0] = `q${colorState.fg}`
      colorArray[1] = `b${colorState.bg}`
      break
    }
    return {
      key: `${part}_${str}`,
      styleStr: colorArray,
      text: str,
    }
  }

  _onPressItem({ id, boradName }) {
    var self = this
    const sendData = ['s', boradName, '\r', '\x1b[C', 'm', '\x1b[4~', '\x1b[4~']
    for (let [i, v] of sendData.entries()) {
      setTimeout(() => {
        self.props.connectSocket.sendtest(v)
        if (i === sendData.length - 1) {
          Actions.childboard({ boardName: boradName })
        }
      }, 0.2)
    }
  }

  renderRow = ({ item }) => {
    return (
      <ListItem
        key={item.index}
        item={item}
        onPressItem={this._onPressItem.bind(this)}
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
              for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                  self.props.connectSocket.sendtest('\x1b[6~')
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

export default Menu
