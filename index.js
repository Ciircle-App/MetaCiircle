/**
 * @format
 */

delete global.URL
delete global.URLSearchParams
import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions'

polyfillGlobal('URLSearchParams', () => require('whatwg-url').URLSearchParams)
polyfillGlobal('URL', () => require('whatwg-url').URL)

import './src/utils/global'
import './src/utils/shim'
import TextEncoder from 'text-encoding-polyfill'
import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'

AppRegistry.registerComponent(appName, () => App)
