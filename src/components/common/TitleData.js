import { View, Text, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

class TitleData extends Component {
  render() {
    const { title, author, time, board } = this.props.articleDetail
    return (
      <View style={styles.containerContent}>
        <View style={{ paddingBottom: 2 }}>
          <Text style={styles.titleStyle}>{title}</Text>
        </View>
        <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="account-circle"
            size={16}
            color="#ffffff"
            style={styles.contentIcon}
          />
          <Text style={styles.textStyle}>{author}</Text>
        </View>
        <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
          <MaterialIcons
            name="access-time"
            size={16}
            color="#ffffff"
            style={styles.contentIcon}
          />
          <Text style={styles.textStyle}>{time}</Text>
        </View>
        <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="file-tree"
            size={16}
            color="#ffffff"
            style={styles.contentIcon}
          />
          <Text style={styles.textStyle}>{board}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  backIcon: {
    paddingLeft: 8,
  },
  contentIcon: {
    paddingLeft: 8,
    paddingRight: 4,
  },
  containerContent: {
    flexDirection: 'column',
    backgroundColor: '#95c967',
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

export default TitleData
