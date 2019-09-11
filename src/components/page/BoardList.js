import React, { PureComponent } from 'react'
import { DeviceEventEmitter, View, StyleSheet, FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import BoaderListItem from './boaderListItem'
import { b2u } from '../../pttJs/string_util'
import { Spinner } from '../common/Spinner'

class BoardList extends PureComponent {
  _isMounted = false

  state = {
    loading: false,
    keyArray: [],
    data: [],
    articleNumArray: [],
    recLargeNum: {},
    reading: false,
  }

  componentDidMount() {
    this._isMounted = true
    setTimeout(() => {
      Actions.refresh({ title: this.props.boardName })
    }, 0.1)

    DeviceEventEmitter.addListener('articleList', lines => {
      if (this._isMounted) {
        // this.setState({ loading: false })
        this.rowArticleDetail(lines)
      }
    })

    DeviceEventEmitter.addListener('readArticle', lines => {
      if (this._isMounted && this.state.reading) {
        let recNum =
          parseInt(
            lines[8]
              .slice(0, 7)
              .map(x => x.ch)
              .join('')
          ) - 1

        let lastNum = this.state.data[this.state.data.length - 1].row.articleNum
        if (recNum > lastNum) {
          this.props.connectSocket.sendtest(`${lastNum}`)
          this.props.connectSocket.sendtest('\r')
          this.props.connectSocket.sendtest('\x1b[C~')
        } else {
          const cutlines = lines.slice(10, 20)
          this.rowArticleDetail(cutlines)
          this.setState({ reading: false })
        }
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  rowArticleDetail(lines) {
    let data = []
    const loc = lines.length - 2
    let recNum = parseInt(
      lines[loc]
        .slice(0, 7)
        .map(x => x.ch)
        .join('')
    )
    for (const [ind1x, termArray] of lines.entries()) {
      let articleNum = termArray
        .slice(0, 7)
        .map(x => x.ch)
        .join('')
      if (articleNum.indexOf('¡´') !== -1) {
        articleNum = articleNum.replace('¡´', '  ')
      }
      articleNum = b2u(articleNum)
      if (!isNaN(articleNum)) {
        articleNum = parseInt(articleNum)
        if (articleNum.toString().length < recNum.toString().length) {
          articleNum = recNum + (loc - ind1x)
        }
      }
      const author = this.getb2u(termArray.slice(16, 30), ind1x, 'author')
      const type = this.getb2u(termArray.slice(30, 32), ind1x, 'type')
      let { category, title } = this.getb2u(
        termArray.slice(33, 80),
        ind1x,
        'title'
      )
      if (type !== '') title = `${type} ${title}`
      const key = `${articleNum}_${author}_${title}`
      if (this.state.keyArray.indexOf(key) !== -1) return
      const date = this.getb2u(termArray.slice(11, 16), ind1x, 'date').trim()
      this.setState({
        keyArray: this.state.keyArray.concat(key),
      })

      const sign = this.getb2u(termArray.slice(7, 9), ind1x, 'sign')
      const popularity = this.getb2u(
        termArray.slice(9, 11),
        ind1x,
        'popularity'
      )

      data.push({
        row: {
          sign: sign,
          popularity: popularity,
          articleNum: articleNum,
          date: date,
          author: author,
          category: category,
          title: title,
        },
        key: key,
      })
    }
    this.setState({ data: this.state.data.concat(data) })
    if (!this.state.loading) this.setState({ loading: true })
    // console.log(this.state.data)
  }

  getb2u(termchar, index, part) {
    const strArry = termchar.map(x => x.ch) //¡´
    let str = strArry.join('')
    switch (part) {
      case 'author':
      case 'popularity':
        str = b2u(str)
        return this.getColorToString(termchar, str.trim(), part, index)
      case 'title':
        str = b2u(str)
        if (str.indexOf('] ') > 5) {
          const category = ''
          const title = str
          return { category, title }
        }
        const cutArray = str.split('] ')
        const category = cutArray.length > 1 ? cutArray[0].substring(1) : ''
        const title = cutArray.length > 1 ? cutArray[1] : cutArray[0]
        return { category, title }
      case 'type':
        str = b2u(str)
        str = str.replace('□', '')
        return str
      default:
        str = b2u(str)
        return str
    }
  }

  getArticleNum(now, next, index) {
    if (now.indexOf('¡´') !== -1) now = now.replace('¡´', '  ')
    if (next.indexOf('¡´') !== -1) next = next.replace('¡´', '  ')

    if (!isNaN(now)) {
      now = parseInt(now)
      next = parseInt(next)
      if (now + 1 !== next || now - 1 !== next) {
        if (index < 19) return now < next ? next + 1 : now
        else return now < next ? next - 1 : now
      }
      return now
    }
    if (now.indexOf('¡¹') === -1) return false
    return b2u(now)
  }

  getColorToString(termArray, str, part, index) {
    let resultArray = []
    if (str.length > 0) {
      if (part === 'author') {
        const colorState = termArray[3].getColor()
        const colorStr = `q${colorState.fg} b${colorState.bg}`
        const recColorArray = colorStr.split(' ')
        if (recColorArray.indexOf('q15') !== -1) {
          str = `${str} (線上)`
        }
        return str
      }
      const colorState = termArray[0].getColor()
      const colorStr = `q${colorState.fg} b${colorState.bg}`
      const recColorArray = colorStr.split(' ')

      resultArray.push({
        key: `${part}_${index}`,
        styleStr: recColorArray,
        text: str,
      })
    } else {
      resultArray.push({
        key: `${part}_${index}`,
        styleStr: ['b0', 'q15'],
        text: str,
      })
    }

    return resultArray
  }

  _onPressItem({ key }) {
    const ka = key.split('_')
    if (ka[0].indexOf('★') !== -1) {
      this.props.connectSocket.sendtest('\x1b[4~')
      const times = this.state.keyArray.indexOf(key)
      let count = 0
      while (count < times) {
        // 傳送上指令
        this.props.connectSocket.sendtest('\x1b[A~')
        count++
      }
      // 傳送右指令
      this.props.connectSocket.sendtest('\x1b[C~')
    } else {
      this.props.connectSocket.sendtest(ka[0])
      this.props.connectSocket.sendtest('\r')
      this.props.connectSocket.sendtest('\x1b[C~')
      if (
        this.state.data.length > 20 &&
        this.state.data[19].row.articleNum > ka[0]
      )
        this.setState({ reading: true })
    }
    // router跳轉
    setTimeout(() => {
      Actions.ArticlePage({ board: this.props.boardName })
    }, 0.1)
  }
  // ★

  renderRow({ item, index }) {
    return (
      <BoaderListItem
        key={`item_${index}`}
        item={item}
        index={index}
        onPressItem={this._onPressItem.bind(this)}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.loading ? <Spinner size="large" /> : null}
        <FlatList
          data={this.state.data}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={item => item.key}
          initialNumToRender={20}
          onEndReached={() => {
            this.props.connectSocket.sendtest('\x1b[5~')
          }}
          onEndReachedThreshold={1}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
})

export default BoardList
