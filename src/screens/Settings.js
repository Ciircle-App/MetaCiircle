import React, {useContext, useState} from 'react'
import {Alert, SafeAreaView, StyleSheet} from 'react-native'
import Card from '../components/common/Card'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AuthContext} from '../navigation/AuthProvider'
import Snackbar from 'react-native-snackbar'
import Clipboard from '@react-native-clipboard/clipboard'
import ConfirmDialog from '../components/common/Dialog'
import {restoreWallet} from '../utils/functions/wallet'

const Settings = ({navigation}) => {
  const {setCurrentAccount} = useContext(AuthContext)
  const [dialogVisible, setDoalogVisivle] = useState(false)
  const [privateKey, setPrivateKey] = useState(null)

  const storeAccount = the_account => {
    try {
      setCurrentAccount(the_account?.address)
      AsyncStorage.setItem('selectedAddress', the_account?.address)
      const accountData = the_account && JSON.stringify(the_account)
      AsyncStorage.setItem('accountData', accountData)
      setDoalogVisivle(false)
      setPrivateKey(null)
      showSeccessSnack()
      setTimeout(() => navigation.navigate('Balance'), 5)
    } catch (error) {
      showSnakError()
    }
  }

  const onDelete = () => {
    Alert.alert('Logout', 'Are you sure do you want to logout?', [
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => deletePeremently(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ])
  }

  deletePeremently = () => {
    AsyncStorage.clear()
    setCurrentAccount(null)
  }

  const onBackup = async () => {
    const accountData = await AsyncStorage.getItem('accountData')
    const the_account = accountData && JSON.parse(accountData)
    console.log('accountData', the_account)
    copyToClipboard(the_account?.privateKey)
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

  const onCreate = () => {
    console.log('create...')
  }

  const onImport = () => {
    console.log('import...')
    setDoalogVisivle(true)
  }

  const importWallet = async () => {
    try {
      const accountData = await restoreWallet(privateKey)
      if (accountData) {
        storeAccount(accountData)
      } else {
        showSnakError()
      }
    } catch (error) {
      showSnakError()
    }
  }

  const handleCancel = () => {
    setDoalogVisivle(false)
  }

  const showSnakError = () => {
    Snackbar.show({
      text: 'Please inter a valid Private Key.',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#FF5252',
    })
  }

  const showSeccessSnack = () => {
    Snackbar.show({
      text: 'Success!.',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#16C79A',
    })
  }

  const goTransaction = () => {
    console.log('transactions...')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Card title="Backup" subtitle="Get your private key" onPress={onBackup} />
      <Card
        title="Create Account"
        subtitle="Create a new Ethereum wallet."
        onPress={onCreate}
      />
      <Card
        title="Restore Wallet"
        subtitle="Restore an Ethereum wallet from private key."
        onPress={onImport}
      />
      <Card
        title="Transactions"
        subtitle="See your history transaction."
        onPress={goTransaction}
      />
      <Card
        title="Logout"
        subtitle="Are you sure you want to logout from this wallet?."
        onPress={onDelete}
      />

      <ConfirmDialog
        title="Restore Wallet"
        descreption="Paste your private key to restore your Ethereum wallet."
        dialogVisible={dialogVisible}
        cancel={handleCancel}
        confirm={importWallet}
        setValue={privateKey => setPrivateKey(privateKey)}
      />
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
})
