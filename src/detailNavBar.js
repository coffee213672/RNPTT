import { View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Actions } from 'react-native-router-flux'
import Constants from 'expo-constants'

class detailNavBar extends Component {
  render() {
    return (
      <View style={styles.backgroundStyle}>
        <View style={styles.statusBar} />
        <MaterialIcons
          name="arrow-back"
          size={30}
          color="#ffffff"
          style={styles.backIcon}
          onPress={() => {
            this.props.connectSocket.sendtest('\x1b[D')
            Actions.pop()
          }}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#95c967',
  },
  statusBar: {
    backgroundColor: '#95c967',
    height: Constants.statusBarHeight,
  },
})

export default detailNavBar
