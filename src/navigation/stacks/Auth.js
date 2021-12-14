import React, {Component} from 'react'
import {View, StyleSheet, Image, Dimensions} from 'react-native'
import {AuthContext} from '../AuthProvider'
import Card from '../../components/common/Card'
import {restoreWallet, createWallet} from '../../utils/functions/wallet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar'
import ConfirmDialog from '../../components/common/Dialog'

const {width} = Dimensions.get('window')

const ethereumAuth = require('../../../assets/eth_auth.webp')

const Auth = () => {
  const [dialogVisible, setIsVisible] = React.useState(false)
  const [privateKey, setPrivateKey] = React.useState()
  const {setCurrentAccount} = React.useContext(AuthContext)

  const storeAccount = the_account => {
    setCurrentAccount(the_account?.address)
    AsyncStorage.setItem('selectedAddress', the_account?.address)
    const accountData = the_account && JSON.stringify(the_account)
    AsyncStorage.setItem('accountData', accountData)
  }

  const showDialog = () => {
    setIsVisible(true)
  }

  const handleCancel = () => {
    setIsVisible(false)
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

  const showSnakError = () => {
    Snackbar.show({
      text: 'Please inter a valid Private Key.',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#FF5252',
    })
  }

  const createNewWallet = async () => {
    try {
      const accountData = await createWallet()
      if (accountData) {
        storeAccount(accountData)
      } else {
        showSnakError()
      }
    } catch (error) {
      showSnakError()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={ethereumAuth} style={styles.image} />
      </View>
      <Card
        title="Create Wallet"
        subtitle="Create a new Ethereum wallet."
        onPress={createNewWallet}
      />
      <Card
        title="Restore Wallet"
        subtitle="Restore an Ethereum wallet from private key."
        onPress={showDialog}
      />
      <ConfirmDialog
        title="Restore Wallet"
        descreption="Paste your private key to restore your Ethereum wallet."
        dialogVisible={dialogVisible}
        cancel={handleCancel}
        confirm={importWallet}
        setValue={privateKey => setPrivateKey(privateKey)}
      />
    </View>
  )
}

export default Auth

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width,
    height: 300,
    marginBottom: 50,
  },
})
