import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Balance from '../../../screens/Balance'
import Receiver from '../../../screens/Receiver'

const Tab = createStackNavigator()

const BalanceStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="BalanceScreen" component={Balance} />
      <Tab.Screen name="Receiver" component={Receiver} />
    </Tab.Navigator>
  )
}

export default BalanceStack
