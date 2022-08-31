import React from 'react'
import Onlinereducer from './onlinereducer'

const initial={
 onlineusers:[],allonlineusers:[]
}
export const OnlineContextt=React.createContext(initial)

export const OnlineContextProvider=({children})=>{
  const [state, dispatch] = React.useReducer(Onlinereducer, initial)
  return (
      <OnlineContextt.Provider value={{onlineusers:state.onlineusers,allonlineusers:state.allonlineusers,dispatc:dispatch}}>
{children}
      </OnlineContextt.Provider>

  )
}