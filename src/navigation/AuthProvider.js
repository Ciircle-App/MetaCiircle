import React, {createContext, useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const [currentAccount, setCurrentAccount] = useState(null)

  useEffect(() => {
    getCurrentAddress()
  }, [])

  const getCurrentAddress = async () => {
    const currentAddess = await AsyncStorage.getItem('selectedAddress')
    console.log('address ===>>>', currentAddess)
    setCurrentAccount(currentAddess)
  }

  return (
    <AuthContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
