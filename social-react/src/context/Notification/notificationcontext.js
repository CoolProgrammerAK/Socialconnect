import React from 'react'
import Notificationreducer from './notificationreducer'

const initial={
 notifications:[],
 fetchnotification:false
}

export const NotificationContextt=React.createContext(initial)

export const NotificationContextProvider=({children})=>{
  const [state, dispatch] = React.useReducer(Notificationreducer, initial)
  return (
      <NotificationContextt.Provider value={{notifications:state.notifications,
      fetchnotification:state.fetchnotification,
      dispatch}}>
{children}
      </NotificationContextt.Provider>

  )
}