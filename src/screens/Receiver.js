import React, {useEffect} from 'react'
import {SafeAreaView, Text, StyleSheet, View} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import BalanceHeader from '../components/common/BalanceHeader'
import Clipboard from '@react-native-clipboard/clipboard'
import {TouchableOpacity} from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import {web3} from '../../libs/configs'

const Receiver = ({navigation}) => {
  const [balance, setBalance] = React.useState(0)
  const [address, setAddress] = React.useState(0x0)

  useEffect(() => {
    getBalance()
  }, [])
  const getBalance = async () => {
    const selectedAddress = await AsyncStorage.getItem('selectedAddress')
    const the_accounts = await web3.eth.getAccounts()
    const currentAddress = selectedAddress || the_accounts[0]
    setAddress(currentAddress)
    const balance = await web3.eth.getBalance(currentAddress)
    setBalance(web3.utils.fromWei(balance, 'ether'))
  }

  const copyToClipboard = value => {
    Clipboard.setString(value)
    showCopiedSuccessSnak()
  }

  const showCopiedSuccessSnak = () => {
    Snackbar.show({
      text: 'Copied to clipboard',
      duration: Snackbar.LENGTH_SHORT,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <BalanceHeader balance={balance} />
      <TouchableOpacity
        onPress={() => {
          copyToClipboard(address)
        }}
        style={styles.addressContainer}>
        <Text style={styles.addressTitle}>
          Current Address: <Icon name="copy" color="#777" size={17} />
        </Text>
        <Text style={styles.addressValue}>{address}</Text>
      </TouchableOpacity>
      <View style={styles.qrCodeContainer}>
        <QRCode
          value={String(address)}
          size={200}
          logoBackgroundColor="transparent"
        />
      </View>
    </SafeAreaView>
  )
}

export default Receiver

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addressContainer: {
    padding: 10,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressValue: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
  },
  qrCodeContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
