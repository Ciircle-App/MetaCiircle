import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog from 'react-native-dialog'
import TransferEth from '../../build/contracts/TransferEth.json'
import {Divider} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import {web3} from '../../libs/configs'

const SendEther = ({navigation}) => {
  const [balance, setBalance] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [visible, setVisible] = React.useState(false)
  const [transactionLoader, setTransactionLoader] = React.useState(false)
  const [receiver, setReceiver] = React.useState('')
  const [accounts, setAccounts] = React.useState([])
  const [currentAddress, setCurrentAddress] = useState(0x0)

  useEffect(() => {
    navigation.addListener('focus', () => {
      getBalance()
    })
    getBalance()
  }, [])
  const getBalance = async () => {
    const selectedAddress = await AsyncStorage.getItem('selectedAddress')
    const accounts = await web3.eth.getAccounts()
    const currentAddress = selectedAddress || accounts[0]
    setAccounts(accounts)
    setCurrentAddress(currentAddress)
    const balance = await web3.eth.getBalance(currentAddress)
    setBalance(web3.utils.fromWei(balance, 'ether'))
  }

  const showSnakBar = () => {
    Snackbar.show({
      text: 'Transaction Successful',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#77ACF1',
    })
  }

  const showSnakError = error => {
    Snackbar.show({
      text: error || 'Transaction Failed',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#FF5252',
    })
  }

  const sendEther = async () => {
    const isAddress = web3.utils.isAddress(receiver)
    if (isAddress) {
      try {
        setVisible(false)
        setTransactionLoader(true)
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = TransferEth.networks[networkId]
        const contractAddress = deployedNetwork.address
        const contract = new web3.eth.Contract(TransferEth.abi, contractAddress)
        const transaction = await contract.methods
        const the_amount = web3.utils.toWei(amount, 'ether')
        const sender = currentAddress
        const defaultAccount = web3.eth.defaultAccount || sender

        transaction
          .sendCoin(receiver, the_amount)
          .send({
            from: sender,
          })
          .then(receipt => {
            web3.eth
              .sendTransaction({
                from: defaultAccount,
                to: receiver,
                value: the_amount,
              })
              .then(() => {
                showSnakBar()
                console.log('receipt', receipt)
                setTransactionLoader(false)
                setAmount('')
                setReceiver('')
                getBalance()
              })
              .catch(err => {
                showSnakError(err.message)
                setTransactionLoader(false)
              })
          })
      } catch (error) {
        showSnakError(error.message)
        setTransactionLoader(false)
      }
    } else {
      Alert.alert('Invalid Address', 'Please enter a valid address')
    }
  }

  const addNumber = number => {
    if (
      amount.toString().length < 5 ||
      amount.toString().includes('.') ||
      number === '.' ||
      number === 'C'
    ) {
      if (number === 'C') {
        setAmount('')
      } else {
        setAmount(amount + number)
      }
    } else {
      Alert.alert('You can only send up to 5 digits')
    }
  }

  return (
    <View style={styles.container}>
      <BalanceHeader balance={balance || 0} />
      <CalculateAmount amount={amount || 0} />
      <Divider style={styles.divider} />
      <View style={styles.calcAndButtonPosition}>
        <CalcNumbers addNumber={addNumber} />
        <SubmitButton
          openDialog={() => {
            setVisible(true)
          }}
          amount={amount}
        />
      </View>
      <ReceiverAddressDialog
        visible={visible}
        onDismiss={() => {
          setVisible(false)
        }}
        onPress={() => {
          sendEther()
        }}
        setReceiver={setReceiver}
        transactionLoader={transactionLoader}
      />
    </View>
  )
}

const ReceiverAddressDialog = ({
  visible,
  onDismiss,
  onPress,
  transactionLoader,
  setReceiver,
}) => {
  return (
    <>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Send Ether</Dialog.Title>
        <Dialog.Description>
          Enter the address you want to send ether to
        </Dialog.Description>
        <Dialog.Input
          onChangeText={receiver => {
            setReceiver(receiver)
          }}
        />
        <Dialog.Button label="Send" onPress={onPress} />
        <Dialog.Button label="Cancel" onPress={onDismiss} />
      </Dialog.Container>

      <Dialog.Container visible={transactionLoader}>
        <Dialog.Title> Processing </Dialog.Title>
        <View style={styles.loaderDialog}>
          <ActivityIndicator color="#000" size="large" />
        </View>
      </Dialog.Container>
    </>
  )
}

const CalculateAmount = ({amount}) => {
  return (
    <View style={styles.amountContainer}>
      <Text style={styles.calc}>{Number(amount).toFixed(2)} ETH</Text>
    </View>
  )
}

const BalanceHeader = ({balance}) => {
  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balance}>
        Available Balance: {Number(balance).toFixed(2)} ETH
      </Text>
    </View>
  )
}

const CalcNumbers = ({addNumber}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.', 'C']
  return (
    <View style={styles.calcContainer}>
      <FlatList
        scrollEnabled={false}
        numColumns={3}
        data={numbers}
        renderItem={({item}) => (
          <CalcNumber addNumber={addNumber} number={item} />
        )}
      />
    </View>
  )
}

const CalcNumber = ({number, addNumber}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        addNumber(number)
      }}
      style={styles.calcNumberContainer}>
      <Text style={styles.calcNumber}>{number}</Text>
    </TouchableOpacity>
  )
}

const SubmitButton = ({openDialog, amount}) => {
  return (
    <View style={styles.submitContainer}>
      <TouchableOpacity
        disabled={amount === ''}
        onPress={() => {
          openDialog(true)
        }}
        style={
          amount.toString().length <= 0
            ? {...styles.disabledSubmitButton}
            : {...styles.submitButton}
        }>
        <Text style={styles.submitText}>SEND</Text>
        <Icon name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingVertical: 20,
    backgroundColor: '#F8EDE3',
  },
  balance: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  divider: {
    marginTop: 20,
  },
  amount: {
    fontSize: 30,
  },
  amountContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  calcAndButtonPosition: {
    // position: 'absolute',
    // bottom: 100,
    // right: 0,
    // left: 0,
  },
  calc: {
    fontSize: 30,
  },
  calcContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  calcNumberContainer: {
    margin: '1%',
    padding: 10,
    width: '32%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcNumber: {
    fontSize: 30,
    color: '#222',
  },
  submitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#77ACF1',
    borderRadius: 30,
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledSubmitButton: {
    backgroundColor: '#ccc',
    borderRadius: 30,
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitText: {
    fontSize: 20,
    color: '#fff',
    marginEnd: 10,
  },
  loaderDialog: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
})

export default SendEther
