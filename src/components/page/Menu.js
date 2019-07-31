import React, { Component } from 'react'
import {
  DeviceEventEmitter,
  View,
  Text,
  FlatList,
  StyleSheet,
  AsyncStorage,
} from 'react-native'
import ListItem from './ListItem'
import { b2u } from '../../pttJs/string_util'

class Menu extends Component {
  state = {
    loading: false,
  }
  componentDidMount() {
    DeviceEventEmitter.addListener('boardList', lines => {
      this.finallyData = this.rowDetail(lines)
      this.setState({ loading: true })
    })
  }

  rowDetail(lines) {
    let rowData = { data: [] }
    lines.forEach((termArray, ind1x) => {
      let num = [],
        boradName = [],
        category = [],
        narration = [],
        popularity = []
      termArray.forEach((termChar, index) => {
        switch (true) {
          case index >= 0 && index < 8:
            num.push(termChar)
            break
          case index >= 8 && index < 23:
            boradName.push(termChar)
            break
          case index >= 23 && index < 28:
            category.push(termChar)
            break
          case index >= 28 && index < 64:
            narration.push(termChar)
            break
          case index >= 64 && index < 67:
            popularity.push(termChar)
            break
          default:
        }
      })
      const existArray = boradName.filter(x => x.ch !== ' ')
      if (existArray.length < 1) return
      rowData.data[ind1x] = {
        row: {
          num: num,
          boradName: boradName,
          category: category,
          narration: narration,
          popularity: popularity,
        },
      }
    })
    return rowData
  }

  renderRow(employee) {
    return <ListItem employee={employee} />
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
            data={this.finallyData.data}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => (index + 1).toString()}
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
    marginTop: 2,
  },
})

export default Menu
