import React, { PureComponent } from 'react'
import { Text, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'

class MailItem extends PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item.key)
  }

  renderMask(colorArray) {
    if (colorArray.indexOf('+') === -1) {
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
    const { sign, date, sender, title } = this.props.item.row
    const key = this.props.item.key
    return (
      <TouchableWithoutFeedback onPress={this._onPress}>
        <View style={this.renderMask(sign)}>
          <View style={styles.ItemContainer}>
            <View style={styles.ContainerLeft}>
              <View style={styles.CLView}>
                <Text style={[styles.CLViewName, styles.q15, styles.b0]}>
                  {title}
                </Text>
              </View>
              <Text style={[styles.CLViewNarr, styles.q15, styles.b0]}>
                {key} {sender}
              </Text>
            </View>
            <View style={styles.ContainerRight}>
              <Text style={[styles.CRView, styles.q15, styles.b0]}>
                {sign} {date}
              </Text>
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
    marginRight: 4,
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
export default MailItem
