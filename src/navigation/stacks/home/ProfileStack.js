import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Settings from '../../../screens/Settings'
import Profile from '../../../screens/Profile'

const Tab = createStackNavigator()

const ProfileStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  )
}

export default ProfileStack
