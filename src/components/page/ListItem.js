import React, { Component } from 'react'
import { Text, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import cx from 'classnames'
import { Actions } from 'react-native-router-flux'
import { CardSection } from '../common'
import { b2u } from '../../pttJs/string_util'

class ListItem extends Component {
  getb2u(termchar, part) {
    const strArry = termchar.map(x => x.ch)
    let str = b2u(strArry.join(''))
    if (part === 'narration') {
      str = str.replace(/[\[|\]|\?]/g, '')
      if (str.length < 2) return <Text style={styles.CLViewNarr}> </Text>
      return <Text style={styles.CLViewNarr}>{str}</Text>
    } else {
      const strLocation = termchar.map(function(x) {
        if (x.ch !== ' ') return x
        return null
      })
      return this.getColorToString(strLocation, str, part)
    }
  }

  getColorToString(termArray, str, part) {
    let spaceArray = []
    let colorArray = []
    let textArray = []
    let resultArray = []
    let lastColorStr = ''

    for (let x of termArray) {
      if (x === null) continue
      if (x.ch.charAt(0) < '\x80') {
        const colorState = x.getColor()
        const colorStr = cx(`q${colorState.fg}`, `b${colorState.bg}`, {
          [`qq${colorState.bg}`]: colorState.blink,
        })
        colorArray.push(colorStr)
      } else {
        if (spaceArray.length < 1) {
          spaceArray.push(x.ch)
        } else {
          const colorState = x.getColor()
          const colorStr = cx(`q${colorState.fg}`, `b${colorState.bg}`, {
            [`qq${colorState.bg}`]: colorState.blink,
          })
          colorArray.push(colorStr)
          spaceArray = []
        }
      }
    }
    // console.log(colorArray)
    for (const [i, v] of colorArray.entries()) {
      console.log(str[i])
      if (lastColorStr === '') {
        lastColorStr = v
        textArray.push(str[i])
        continue
      }

      if (lastColorStr === v) {
        textArray.push(str[i])
      } else {
        const recColorArray = lastColorStr.split(' ')
        console.log(textArray.join(''))
        console.log(lastColorStr)
        resultArray.push(
          <Text style={styles[recColorArray[0]]}>{textArray.join('')}</Text>
        )

        if (i === colorArray.length - 1) {
          return resultArray
        } else {
          lastColorStr = ''
          textArray = []
          lastColorStr = v
          textArray.push(str[i])
          continue
        }
      }

      if (i === colorArray.length - 1) {
        const recColorArray = lastColorStr.split(' ')
        resultArray.push(
          <Text style={styles[recColorArray[0]]}>{textArray.join('')}</Text>
        )
        return resultArray
      }
    }
  }

  render() {
    // const boradName = this.getb2u(this.props.employee.item.row.boradName)
    // const category = this.getb2u(this.props.employee.item.row.category).replace(
    //   /[\[|\]|\?]/g,
    //   ''
    // )
    // const narration = this.getb2u(this.props.employee.item.row.narration)
    // const popularity = this.getb2u(this.props.employee.item.row.popularity)
    // {num} {boradName} {category} {narration} {popularity}
    return (
      <TouchableWithoutFeedback onPress={() => console.log('press')}>
        <View style={styles.ItemContainer}>
          <View style={styles.ContainerLeft}>
            <View style={styles.CLView}>
              <Text style={styles.CLViewName}>
                {this.getb2u(
                  this.props.employee.item.row.boradName,
                  'boardname'
                )}
              </Text>
              <Text style={styles.CLViewCate}>
                {this.getb2u(this.props.employee.item.row.category, 'category')}
              </Text>
            </View>
            {this.getb2u(this.props.employee.item.row.narration, 'narration')}
          </View>
          <View style={styles.ContainerRight}>
            {/* <Text style={styles.CRView}>{popularity}</Text> */}
            <Text style={styles.CRView}>
              {this.getb2u(
                this.props.employee.item.row.popularity,
                'popularity'
              )}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

// const styles = {
//   titleStyle: {
//     fontSize: 18,
//     paddingLeft: 15,
//   },
// }

const styles = StyleSheet.create({
  ItemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#272727',
  },
  ContainerLeft: {
    flex: 3,
  },
  ContainerRight: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  CLView: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  CLViewName: {
    fontSize: 18,
    // color: '#ffffff',
    // marginRight: 1,
  },
  CLViewCate: {
    borderRadius: 5,
    padding: 2,
    textAlign: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    // color: '#7b7b7b',
  },
  CLViewNarr: {
    color: '#7b7b7b',
    fontSize: 14,
  },
  CRView: {
    // color: '#7b7b7b'
    textAlign: 'right',
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
    color: 'transparent',
  },
  b1: {
    color: '#800000',
  },
  b2: {
    color: '#008000',
  },
  b3: {
    color: '#808000',
  },
  b4: {
    color: '#000080',
  },
  b5: {
    color: '#800080',
  },
  b6: {
    color: '#008080',
  },
  b7: {
    color: '#c0c0c0',
  },
  b8: {
    color: '#808080',
  },
  b9: {
    color: '#ff0000',
  },
  b10: {
    color: '#00ff00',
  },
  b11: {
    color: '#ffff00',
  },
  b12: {
    color: '#0000ff',
  },
  b13: {
    color: '#ff00ff',
  },
  b14: {
    color: '#00ffff',
  },
  b15: {
    color: '#ffffff',
  },
})
export default ListItem
