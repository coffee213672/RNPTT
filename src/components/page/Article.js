import React, { PureComponent } from 'react'
import { DeviceEventEmitter, View, Text, StyleSheet } from 'react-native'
import { b2u } from '../../pttJs/string_util'
import TitleData from '../common/TitleData'

class Article extends PureComponent {
  _isMounted = false

  state = {
    loading: false,
    firstLoad: true,
    navData: {},
    startRow: 0,
    endRow: 0,
    pagePercent: 0,
  }

  componentDidMount() {
    this._isMounted = true

    DeviceEventEmitter.addListener('article', lines => {
      if (this._isMounted) {
        const pagePercent = parseInt(
          lines[23]
            .slice(18, 21)
            .map(x => x.ch)
            .join('')
        )
        const row = lines[23]
          .slice(37, 44)
          .map(x => x.ch)
          .join('')
          .split('/')
        this.setState({
          pagePercent: pagePercent,
          startRow: parseInt(row[0]),
          endRow: parseInt(row[1]),
        })
        if (this.state.firstLoad) {
          this.renderTitle(lines.slice(0, 3))
          // this.rowDetail(lines.slice(4, 23)) // +3
          this.setState({ firstLoad: false })
        }
        // this.rowDetail(lines)
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  renderTitle(termArray) {
    const author = b2u(
      termArray[0]
        .slice(7, 50)
        .map(x => x.ch)
        .join('')
        .trim()
    )
    const board = this.props.board
    const title = b2u(
      termArray[1]
        .slice(7, 80)
        .map(x => x.ch)
        .join('')
        .trim()
    )
    const time = termArray[2]
      .slice(7, 32)
      .map(x => x.ch)
      .join('')
    this.setState({
      navData: { author: author, board: board, title: title, time: time },
    })
  }

  rowDetail(termArray) {
    let recbg, recfg, recinvert, recbright
    let colorArray = []
    let strArray = []
    let totalStrArray = []
    //¡° ¤å³¹ºô§}:
    for (let x of termArray) {
      if (x.ch !== ' ') {
        switch (true) {
          case recbg === undefined:
            recbg = x.bg
            recfg = x.fg
            recinvert = x.invert
            recbright = x.bright

            const colorState = x.getColor()
            colorArray.push([`q${colorState.fg}`, `b${colorState.bg}`])
            strArray.push(x.ch)
            break
          case recbg === x.bg:
            strArray.push(x.ch)
            break
          case recbg !== x.bg:
            if (strArray.length > 0) {
              totalStrArray.push(strArray)
              strArray = []
            }
            const colorState_r = x.getColor()
            colorArray.push([`q${colorState_r.fg}`, `b${colorState_r.bg}`])
            strArray.push(x.ch)
            break
          default:
        }
      } else strArray.push(x.ch)
    }
    return {}
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

  render() {
    return (
      <View style={styles.container}>
        {Object.keys(this.state.navData).length > 0 ? (
          <TitleData
            articleDetail={this.state.navData}
            connectSocket={this.props.connectSocket}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#000000',
  },
})

export default Article
