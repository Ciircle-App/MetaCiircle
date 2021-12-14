import 'react-native-gesture-handler'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {Provider as PaperProvider} from 'react-native-paper'
import Providers from './src/navigation/Index'

class App extends React.Component {
  render() {
    const linking = {
      prefixes: ['metamask://'],
      screens: {
        Home: {
          path: 'Home',
        },
        Transfer: {
          path: 'Transfer',
        },
      },
    }

    return (
      <PaperProvider>
        <NavigationContainer linking={linking}>
          <Providers />
        </NavigationContainer>
      </PaperProvider>
    )
  }
}

export default App
