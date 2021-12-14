import React from 'react'
import Main from './stacks/Main'
import Auth from './stacks/Auth'
import {AuthContext} from './AuthProvider'

const Router = () => {
  const {currentAccount} = React.useContext(AuthContext)

  return currentAccount ? <Main /> : <Auth />
}

export default Router
