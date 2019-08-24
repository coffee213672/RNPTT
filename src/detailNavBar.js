import { View, Text, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import Constants from 'expo-constants'

class detailNavBar extends Component {
  render() {
    return (
      <View style={styles.backgroundStyle}>
        <View style={styles.statusBar} />
        <View style={styles.containerContent}>
          <MaterialIcons
            name="arrow-back"
            size={30}
            color="#ffffff"
            style={styles.backIcon}
          />
          <View style={{ paddingBottom: 2 }}>
            <Text style={styles.titleStyle}>
              [爆掛] 我那裏超大的我那裏超大的
            </Text>
          </View>
          <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
            <MaterialCommunityIcons
              name="account-circle"
              size={16}
              color="#ffffff"
              style={styles.contentIcon}
            />
            <Text style={styles.textStyle}>coffee213698 (G_D)</Text>
          </View>
          <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
            <MaterialIcons
              name="access-time"
              size={16}
              color="#ffffff"
              style={styles.contentIcon}
            />
            <Text style={styles.textStyle}>Fir Aug 23 16:26:30 2019</Text>
          </View>
          <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
            <MaterialCommunityIcons
              name="file-tree"
              size={16}
              color="#ffffff"
              style={styles.contentIcon}
            />
            <Text style={styles.textStyle}>Gossiping</Text>
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#95c967',
  },
  backIcon: {
    paddingLeft: 8,
  },
  contentIcon: {
    paddingLeft: 8,
    paddingRight: 4,
  },
  statusBar: {
    backgroundColor: '#95c967',
    height: Constants.statusBarHeight,
  },
  containerContent: {
    flexDirection: 'column',
  },
  titleStyle: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  textStyle: {
    fontSize: 12,
    color: '#ffffff',
  },
})

export default detailNavBar
