import React from 'react'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import BalanceStack from './home/BalanceStack'
import Home from '../../screens/Home'
import ProfileStack from './home/ProfileStack'
import Transfer from '../../screens/Transfer'
import Icon from 'react-native-vector-icons/Ionicons'
import Create from '../../screens/Create'

const Tab = createMaterialBottomTabNavigator()

const Main = () => {
  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: '#F8EDE3',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={23} />,
        }}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => <Icon name="send" color={color} size={23} />,
        }}
        name="Transfer"
        component={Transfer}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="add-circle-outline" color={color} size={23} />
          ),
        }}
        name="Create"
        component={Create}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="wallet" color={color} size={23} />
          ),
        }}
        name="Balance"
        component={BalanceStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="person" color={color} size={23} />
          ),
        }}
        name="ProfileStack"
        component={ProfileStack}
      />
    </Tab.Navigator>
  )
}

export default Main
