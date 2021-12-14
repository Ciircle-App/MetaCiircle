import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import SendEther from './SendEther'
import Receiver from './Receiver'

const Tab = createStackNavigator()

const Transfer = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="SendEther" component={SendEther} />
      <Tab.Screen name="Receiver" component={Receiver} />
    </Tab.Navigator>
  )
}

export default Transfer
