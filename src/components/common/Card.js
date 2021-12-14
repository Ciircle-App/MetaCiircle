import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

const Card = ({title, subtitle, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.cardButton}
      onPress={() => {
        onPress()
      }}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Card

const styles = StyleSheet.create({
  cardButton: {
    width: '100%',
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    maxHeight: 200,
    backgroundColor: '#F8EDE3',
    borderRadius: 10,
    width: '90%',
  },
  textContainer: {
    paddingVertical: 20,
  },
  cardTitle: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cardText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
})
