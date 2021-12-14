import {web3} from '../../../libs/configs'

const createWallet = async () => {
  const account = web3.eth.accounts.create()
  console.log('wallet created', account)
  return account
}

const restoreWallet = async privateKey => {
  console.log('privateKey', privateKey)
  try {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    console.log('wallet restored', account)
    return account
  } catch (error) {
    console.error(error)
    return
  }
}

export {createWallet, restoreWallet}
