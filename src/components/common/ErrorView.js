import React from 'react'
import {
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
const eth_err = require('../../../assets/eth_err.webp')

export default ErrorView = ({tryAgain, message}) => {
  return (
    <SafeAreaView style={errorStyles.loader}>
      <Image style={errorStyles.eth_error} source={eth_err} />
      <Text style={errorStyles.title}>Opps :/</Text>
      <Text style={errorStyles.subtTitle}>
        {message || 'Something went wrong'}
      </Text>

      <TouchableOpacity
        style={errorStyles.button}
        onPress={() => {
          tryAgain()
        }}>
        <Text style={errorStyles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const errorStyles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eth_error: {
    width: 300,
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  subtTitle: {
    fontSize: 16,
    color: '#444',
    marginVertical: 15,
    width: '80%',
    textAlign: 'center',
  },
  button: {
    marginTop: 50,
    backgroundColor: '#77ACF1',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
})
