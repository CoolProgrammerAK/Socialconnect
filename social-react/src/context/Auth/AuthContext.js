import React from 'react'
import Authreducer from './AuthReducer'

const initial={
    user:JSON.parse(localStorage.getItem('user'))??null,
    isFetching:{login:false,register:false},
    error:""

}
export const AuthContextt=React.createContext(initial)

export const AuthContextProvider=({children})=>{
  const [state, dispatch] = React.useReducer(Authreducer, initial)
  return (
      <AuthContextt.Provider value={{user:state.user,error:state.error,isFetching:state.isFetching,dispatch}}>
{children}
      </AuthContextt.Provider>

  )
}