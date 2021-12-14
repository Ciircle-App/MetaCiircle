import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const BalanceHeader = ({balance}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Balance</Text>
      <Text style={styles.balance}>{Number(balance || 0).toFixed(2)} ETH</Text>
    </View>
  )
}

export default BalanceHeader

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    color: '#333',
    marginBottom: 5,
  },
  balance: {
    fontSize: 33,
    fontWeight: 'bold',
    color: '#000',
  },
})
