import React, {useEffect, useState} from 'react'
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import SelectDropdown from 'react-native-select-dropdown'
import BalanceHeader from '../components/common/BalanceHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import {web3} from '../../libs/configs'
import ErrorView from '../components/common/ErrorView'

const ethImage = require('../../assets/eth.png')

const Balance = ({navigation}) => {
  const [balance, setBalance] = useState(0)
  const [account, setAccount] = useState('')
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    navigation.addListener('focus', () => {
      fetchBlockChainData(false)
    })
    fetchBlockChainData(true)
  }, [])

  const fetchBlockChainData = async isLoader => {
    setLoading(isLoader)
    const selectedAddress = await AsyncStorage.getItem('selectedAddress')
    try {
      const the_accounts = await web3.eth.getAccounts()
      const currentAddress = selectedAddress || the_accounts[0]
      const balance = await web3.eth.getBalance(selectedAddress || accounts[0])
      setAccounts(the_accounts)
      setAccount(currentAddress)
      setBalance(web3.utils.fromWei(balance, 'ether'))
    } catch (error) {
      showSnakError()
      setError(true)
      setErrorMessage(error.message)
    }
    setTimeout(() => setLoading(false), 0)
  }

  const showSnakError = () => {
    Snackbar.show({
      text: 'Please select an account',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#FF5252',
    })
  }

  const onAccountChange = async account => {
    const balance = await web3.eth.getBalance(account)
    setAccount(account)
    AsyncStorage.setItem('selectedAddress', account)
    setBalance(web3.utils.fromWei(balance, 'ether'))
  }

  if (loading) {
    return <Loader />
  } else if (error) {
    return (
      <ErrorView
        message={errorMessage}
        tryAgain={() => fetchBlockChainData(true)}
      />
    )
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <BalanceHeader balance={balance} />
        <SenderAndReceiver navigation={navigation} />
        <AccountDisplayer
          account={account}
          balance={balance}
          accounts={accounts}
          onAccountChange={onAccountChange}
        />
      </SafeAreaView>
    )
  }
}

const SenderAndReceiver = ({navigation}) => {
  return (
    <View style={senderStyles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Transfer')
        }}
        activeOpacity={0.8}
        style={{
          ...senderStyles.senderAndReceiver,
          ...senderStyles.sendBackground,
        }}>
        <Text style={senderStyles.senderAndReceiverText}>Send</Text>
        <Icon name="send" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Receiver')
        }}
        activeOpacity={0.8}
        style={{
          ...senderStyles.senderAndReceiver,
          ...senderStyles.receiveBackground,
        }}>
        <Text style={senderStyles.senderAndReceiverText}>Get ETH</Text>
        <Icon name="qr-code-sharp" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const AccountDisplayer = ({account, balance, accounts, onAccountChange}) => {
  return (
    <View style={accountStyle.container}>
      <View style={accountStyle.accountBalanceContainer}>
        <View style={accountStyle.accountIcon}>
          <Image source={ethImage} style={accountStyle.logo} />
          <View style={accountStyle.logoTextContaoner}>
            <Text style={accountStyle.logoTitle}>ETH</Text>
            <Text style={accountStyle.logoSubtitle}>Ethereum</Text>
          </View>
        </View>
        <View style={accountStyle.accountBalance}>
          <Text style={accountStyle.accountBalanceTitle}>{balance} ETH</Text>
        </View>
      </View>

      <View style={accountStyle.accountInfo}>
        <SelectDropdown
          data={accounts || []}
          onSelect={(selectedItem, index) => {
            onAccountChange(selectedItem)
          }}
          defaultText={account}
          buttonStyle={accountStyle.dropdownButton}
          renderCustomizedButtonChild={() => (
            <View style={accountStyle.dropdownButtonView}>
              <Text numberOfLines={1} style={accountStyle.accountName}>
                {account}
              </Text>
              <Icon name="chevron-down" size={20} color="#000" />
            </View>
          )}
          dropdownStyle={accountStyle.dropdownStyle}
          rowStyle={accountStyle.rowStyle}
        />
      </View>
    </View>
  )
}

export default Balance

const Loader = () => {
  return (
    <SafeAreaView style={styles.loader}>
      <ActivityIndicator size="large" color="#000" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eth_error: {},
})

const accountStyle = StyleSheet.create({
  container: {
    marginTop: 25,
    backgroundColor: '#F8EDE3',
    width: '90%',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: '5%',
    marginTop: 50,
  },
  accountBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  accountBalance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountBalanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  accountIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextContaoner: {
    marginStart: 10,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  logoSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  logo: {
    width: 34,
    height: 57,
  },
  accountInfo: {
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    paddingTop: 10,
  },
  dropdownButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    width: '100%',
  },
  dropdownButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '600',
    width: '90%',
  },
  accountAddress: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  dropdownStyle: {
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
})

const senderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  senderAndReceiver: {
    padding: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  senderAndReceiverText: {
    color: '#fff',
    fontSize: 20,
    marginRight: 10,
  },
  sendBackground: {
    backgroundColor: '#77ACF1',
  },
  receiveBackground: {
    backgroundColor: '#BDD2B6',
  },
})
