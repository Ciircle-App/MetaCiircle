// Config ipfs for React Native

delete global.URL
delete global.URLSearchParams
import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions'

polyfillGlobal('URLSearchParams', () => require('whatwg-url').URLSearchParams)
polyfillGlobal('URL', () => require('whatwg-url').URL)

import {Platform} from 'react-native'

const HTTP_CLIENT_URL = Platform.select({
  ios: 'http://localhost:5002',
  android: 'http://10.0.2.2:5002',
})

export {HTTP_CLIENT_URL}

const ipfsClient = require('ipfs-http-client')
const url = 'https://ipfs.infura.io:5001/api/v0/'

const ipfsCreate = ipfsClient.create(url, (err, ipfs) => {
  if (err) {
    console.error('err ===>>', err)
    return
  }
  console.log('ipfs init')
})

export default ipfsCreate
