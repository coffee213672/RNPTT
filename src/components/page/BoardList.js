import React, { PureComponent } from 'react'
import { DeviceEventEmitter, View, StyleSheet, FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import BoaderListItem from './boaderListItem'
import { b2u } from '../../pttJs/string_util'

class BoardList extends PureComponent {
  _isMounted = false

  state = {
    loading: false,
    keyArray: [],
    data: [],
    articleNo: 0,
  }

  componentDidMount() {
    this._isMounted = true

    setTimeout(() => {
      Actions.refresh({ title: this.props.boardName })
    }, 0.1)

    DeviceEventEmitter.addListener('articleList', lines => {
      if (this._isMounted) this.rowArticleDetail(lines)
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  rowArticleDetail(lines) {
    for (const [ind1x, termArray] of lines.entries()) {
      const nextNum = ind1x < 19 ? ind1x + 1 : ind1x - 1
      let setArticleNo = lines[nextNum]
        .slice(0, 7)
        .map(x => x.ch)
        .join('')
      let articleNum = this.getArticleNum(
        termArray
          .slice(0, 7)
          .map(x => x.ch)
          .join(''),
        setArticleNo
      )
      const date = this.getb2u(termArray.slice(11, 16), ind1x, 'date').trim()
      const author = this.getb2u(termArray.slice(16, 30), ind1x, 'author')
      const key = `${articleNum}_${date}_${author}`
      if (this.state.keyArray.indexOf(key) !== -1) break
      this.setState({ keyArray: this.state.keyArray.concat(key) })

      const sign = this.getb2u(termArray.slice(7, 9), ind1x, 'sign')
      const popularity = this.getb2u(
        termArray.slice(9, 11),
        ind1x,
        'popularity'
      )
      const type = this.getb2u(termArray.slice(30, 32), ind1x, 'type')
      let { category, title } = this.getb2u(
        termArray.slice(33, 80),
        ind1x,
        'title'
      )
      if (type !== '') title = `${type} ${title}`

      this.setState({
        data: this.state.data.concat({
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
        }),
      })
    }
    this.setState({ loading: true })
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

  getArticleNum(now, next) {
    if (now.indexOf('¡´') !== -1) now = now.replace('¡´', '')
    if (next.indexOf('¡´') !== -1) next = next.replace('¡´', '')

    if (!isNaN(now)) {
      now = parseInt(now)
      next = parseInt(next)
      if (now + 1 !== next || now - 1 !== next) {
        return now < next ? next + 1 : now
      }
      return now
    }
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

  renderRow({ item, index }) {
    return <BoaderListItem key={`item_${index}`} item={item} index={index} />
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={item => item.key}
          initialNumToRender={20}
          onEndReached={() => {
            let self = this
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                self.props.connectSocket.sendtest('\x1b[5~')
              }, 0.3)
            }
          }}
          onEndReachedThreshold={0.9}
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
