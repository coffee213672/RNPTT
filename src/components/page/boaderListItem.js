import React, { PureComponent } from 'react'
import { Text, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'

class BoaderListItem extends PureComponent {
  _onPress = () => {
    this.props.onPressItem({
      key: this.props.item.key,
    })
  }

  renderText(data) {
    let renderData = []
    for (const v of data) {
      renderData.push(
        <Text
          key={v.key}
          style={[
            styles[v.styleStr[0]],
            styles[v.styleStr[1]],
            styles.CLViewPop,
          ]}
        >
          {v.text}
        </Text>
      )
      // console.log(`key:${v.key}, style:${v.styleStr}, text:${v.text}`)
    }
    return renderData
  }

  renderMask(sign) {
    if (sign === ' m' || sign === '  ') {
      return {
        borderColor: '#000000',
        opacity: 0.45,
      }
    } else {
      return {
        borderColor: '#ffffff',
      }
    }
  }

  render() {
    const item = this.props.item.row
    // console.log(`sign:${item.sign}, length:${item.sign.length}`)
    return (
      <TouchableWithoutFeedback onPress={this._onPress}>
        <View style={this.renderMask(item.sign)}>
          <View style={styles.ItemContainer}>
            <View style={styles.ContainerLeft}>
              <View style={styles.CLView}>
                <Text style={styles.CLViewName}>{item.category}</Text>
                {this.renderText(item.popularity)}
              </View>
            </View>
            <View style={styles.ContainerRight}>
              <View style={styles.CLView}>
                <View>
                  <Text style={styles.CLViewNarr}>{item.title}</Text>
                </View>
                <View style={styles.CRViewDowm}>
                  <View
                    style={{
                      width: '45%',
                      flexDirection: 'row',
                      textAlign: 'left',
                    }}
                  >
                    <Text style={styles.CLViewDownNum}>{item.articleNum}</Text>
                    <Text style={styles.CLViewDownAuthor}>
                      {item.author.trim()}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '55%',
                      textAlign: 'right',
                    }}
                  >
                    <Text style={styles.CLViewDown1}>
                      {item.sign} {item.date}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  ItemContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#272727',
  },
  ContainerLeft: {
    flex: 1,
    paddingLeft: 2,
    alignItems: 'center',
    alignSelf: 'center',
  },
  ContainerRight: {
    flex: 9,
    alignSelf: 'stretch',
    padding: 4,
    // alignSelf: 'flex-end',
  },
  CLView: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  CLViewName: {
    fontSize: 12,
    color: '#ffffff',
  },
  CLViewDownNum: {
    fontSize: 12,
    color: '#7b7b7b',
    paddingLeft: 5,
    paddingRight: 5,
  },
  CLViewDownAuthor: {
    fontSize: 12,
    color: '#7b7b7b',
    paddingLeft: 5,
    paddingRight: 5,
  },
  CLViewDown1: {
    fontSize: 12,
    color: '#7b7b7b',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'right',
  },
  CLViewCate: {
    borderRadius: 5,
    padding: 2,
    textAlign: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#272727',
    // color: '#7b7b7b',
  },
  CLViewNarr: {
    color: '#ffffff',
    fontSize: 18,
  },
  CLViewPop: {
    textAlign: 'center',
    fontSize: 18,
  },
  CRView: {
    // color: '#7b7b7b'
    textAlign: 'right',
  },
  CRViewDowm: {
    flexDirection: 'row',
    // alignSelf: 'stretch',
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
export default BoaderListItem
