import React, { PureComponent } from 'react'
import {
  DeviceEventEmitter,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
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
    data: [],
    recData: [],
    commentIndex: 1,
    // pageEnd: false,
  }

  componentDidMount() {
    this._isMounted = true

    DeviceEventEmitter.addListener('article', lines => {
      if (this._isMounted) {
        const pagePercent = parseInt(
          lines[23]
            .slice(16, 25)
            .map(x => x.ch)
            .filter(word => {
              return !isNaN(word)
            })
            .join('')
        )
        const row = lines[23]
          .slice(37, 50)
          .map(x => x.ch)
          .filter(word => {
            return !isNaN(word) || word === '~'
          })
          .join('')
          .split('~')
        // console.log(`pageData: 第${row[0]}行 ~ 第${row[1]}行, (${pagePercent})`)
        if (this.state.firstLoad) {
          this.setState({
            pagePercent: pagePercent,
            startRow: parseInt(row[0]),
            endRow: parseInt(row[1]),
          })

          this.renderTitle(lines.slice(0, 3))
          this.rowDetail(lines.slice(4, 23))
          this.setState({ firstLoad: false })
        } else {
          if (pagePercent !== this.state.pagePercent) {
            this.setState({
              pagePercent: pagePercent,
              startRow: parseInt(row[0]),
              endRow: parseInt(row[1]),
            })
            this.rowDetail(lines.slice(1, 23))
          }
        }
        // this.rowDetail(lines)
      }
    })
  }

  //¡° ¤å³¹ºô§}: https://www.ptt.cc/  13~79
  //註解¡÷  推±À 噓¼N

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

  rowDetail(lines) {
    let totalStrArray = []
    const len = this.state.data.length
    for (let [index, termArray] of lines.entries()) {
      let recColorStr = ''
      let colorArray = []
      let strArray = []
      let sentence = []
      const sentenceStr = termArray.map(x => x.ch).join('')
      // const isUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i.exec(
      //   sentenceStr
      // )
      // const url = isUrl !== null ? isUrl[0] : null
      // "¡° ¤å³¹ºô§}: https://www.ptt.cc/bbs/Gossiping/M.1567913770.A.990.html           "

      if (this.state.startRow !== 1 || this.state.pageEnd) {
        if (this.state.recData.indexOf(sentenceStr) !== -1) continue
      }

      if (sentenceStr.indexOf('¡° ¤å³¹ºô§}: https://www.ptt.cc/') !== -1) {
        this.setState({ pageEnd: true, commentIndex: 1 })
      }

      this.setState({ recData: this.state.recData.concat(sentenceStr) })
      // 註解¡÷  推±À 噓¼N
      if (
        sentenceStr.indexOf('±À ') !== -1 ||
        sentenceStr.indexOf('¼N ') !== -1 ||
        sentenceStr.indexOf('¡÷ ') !== -1
      ) {
        if (this.state.navData.board === 'Gossiping' && this.state.pageEnd) {
          sentence.push({
            type: sentenceStr.substring(0, 2),
            content: sentenceStr.substring(3, 51).trim(),
            ip: sentenceStr.substring(51, 67).trim(),
            time: sentenceStr.substring(67, 79).trim(),
            commentIndex: this.state.commentIndex,
          })
        } else {
          sentence.push({
            type: sentenceStr.substring(0, 2),
            content: sentenceStr.substring(3, 67).trim(),
            ip: '',
            time: sentenceStr.substring(67, 79).trim(),
            commentIndex: this.state.commentIndex,
          })
        }
        this.setState({ commentIndex: this.state.commentIndex + 1 })
        totalStrArray.push({ comment: true, sentence: sentence })
      } else {
        for (let [i, x] of termArray.entries()) {
          if (x.ch !== ' ') {
            const colorState = x.getColor()
            const colorStr = `q${colorState.fg}b${colorState.bg}`
            switch (true) {
              case recColorStr === '':
                recColorStr = colorStr
                colorArray.push([`q${colorState.fg}`, `b${colorState.bg}`])
                strArray.push(x.ch)
                break
              case recColorStr !== colorStr:
                recColorStr = colorStr
                if (strArray.length > 0) {
                  sentence.push({
                    text: strArray.join(''),
                    color: colorArray,
                    index: len + index,
                  })
                  strArray = []
                  colorArray = []
                }
                colorArray.push([`q${colorState.fg}`, `b${colorState.bg}`])
                strArray.push(x.ch)
                break
              case recColorStr === colorStr:
                strArray.push(x.ch)
                break
              default:
            }
          } else strArray.push(x.ch)

          if (i === termArray.length - 1) {
            sentence.push({
              text: strArray.join(''),
              color: colorArray,
              index: len + index,
            })
            strArray = []
            colorArray = []
            totalStrArray.push({ comment: false, sentence: sentence })
          }
        }
      }
    }
    this.setState({ data: this.state.data.concat(totalStrArray) })
    if (this.state.pagePercent < 100)
      this.props.connectSocket.sendtest('\x1b[6~')
    // console.log(totalStrArray)
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
      <ScrollView contentContainerStyle={styles.container}>
        {Object.keys(this.state.navData).length > 0 ? (
          <TitleData
            articleDetail={this.state.navData}
            connectSocket={this.props.connectSocket}
          />
        ) : null}
        {this.state.data.map((v, index) => {
          // console.log(v)
          let strArray = []
          if (!v.comment) {
            for (let [i, x] of v.sentence.entries()) {
              if (x.color.length < 1) {
                return <Text key={x.index}>{x.text}</Text>
              } else {
                let text = ''
                if (x.color[0].indexOf('b0') === -1) text = x.text.trim()
                else text = x.text
                strArray.push(
                  <Text
                    key={`${x.index}_${i}`}
                    style={[styles[x.color[0][0]], styles[x.color[0][1]]]}
                  >
                    {b2u(text)}
                  </Text>
                )
              }
            }
            return (
              <View key={`view_${index}`} style={{ flexDirection: 'row' }}>
                <Text
                  key={`text_${index}`}
                  style={{ flex: 1, flexWrap: 'wrap' }}
                >
                  {strArray}
                </Text>
              </View>
            )
          } else {
            const content = v.sentence[0].content.split(':') // 註解¡÷  推±À 噓¼N
            let color = ''
            if (v.sentence[0].type === '¡÷') color = 'note'
            else if (v.sentence[0].type === '±À') color = 'push'
            else color = 'downvote'
            return (
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.commentColorContainer, styles[color]]} />
                <View style={styles.commentContentContainer}>
                  <View style={styles.commentContainer}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.commentUserText}>
                          {content[0]} {`[${v.sentence[0].commentIndex}樓]`}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.commentTimeText}>
                          {v.sentence[0].time}
                        </Text>
                      </View>
                    </View>

                    {v.sentence[0].ip !== '' ? (
                      <View style={styles.commentContainer}>
                        <View style={styles.textContainer}>
                          <Text style={styles.commentUserText}>
                            {v.sentence[0].ip}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    <View style={styles.commentContainer}>
                      <Text style={styles.commentContentText}>
                        {b2u(content[1])}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          }
        })}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: 'center',
    backgroundColor: '#000000',
  },
  commentContainer: {
    flexDirection: 'column',
  },

  commentColorContainer: {
    width: '2%',
    paddingRight: 2,
    // backgroundColor: '#fa0202',
  },

  push: {
    backgroundColor: '#95c967', // 推
  },

  downvote: {
    backgroundColor: '#fa0202', // 噓
  },

  note: {
    backgroundColor: '#9a78f0', //註解
  },

  commentContentContainer: {
    width: '98%',
    flexDirection: 'column',
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: '#384037',
  },

  textContainer: {
    flex: 1,
  },

  commentUserText: {
    fontSize: 14,
    color: '#ffffff',
  },

  commentTimeText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'right',
  },

  commentContentText: {
    fontSize: 16,
    color: '#dbb13d',
  },

  q0: {
    color: '#000000',
  },
  q1: {
    color: '#800000',
  },
  q2: {
    color: '#008000',
  },
  q3: {
    color: '#808000',
  },
  q4: {
    color: '#000080',
  },
  q5: {
    color: '#800080',
  },
  q6: {
    color: '#008080',
  },
  q7: {
    color: '#c0c0c0',
  },
  q8: {
    color: '#808080',
  },
  q9: {
    color: '#ff0000',
  },
  q10: {
    color: '#00ff00',
  },
  q11: {
    color: '#ffff00',
  },
  q12: {
    color: '#0000ff',
  },
  q13: {
    color: '#ff00ff',
  },
  q14: {
    color: '#00ffff',
  },
  q15: {
    color: '#ffffff',
  },
  b0: {
    backgroundColor: 'transparent',
  },
  b1: {
    backgroundColor: '#800000',
  },
  b2: {
    backgroundColor: '#008000',
  },
  b3: {
    backgroundColor: '#808000',
  },
  b4: {
    backgroundColor: '#000080',
  },
  b5: {
    backgroundColor: '#800080',
  },
  b6: {
    backgroundColor: '#008080',
  },
  b7: {
    backgroundColor: '#c0c0c0',
  },
  b8: {
    backgroundColor: '#808080',
  },
  b9: {
    backgroundColor: '#ff0000',
  },
  b10: {
    backgroundColor: '#00ff00',
  },
  b11: {
    backgroundColor: '#ffff00',
  },
  b12: {
    backgroundColor: '#0000ff',
  },
  b13: {
    backgroundColor: '#ff00ff',
  },
  b14: {
    backgroundColor: '#00ffff',
  },
  b15: {
    backgroundColor: '#ffffff',
  },
})

export default Article
