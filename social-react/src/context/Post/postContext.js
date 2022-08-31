import React from 'react'
import Postreducer from './postReducer'

const initial={
   isfetchingposts:false,
   isfetchingprofile:false
}
export const PostContextt=React.createContext(initial)

export const PostContextProvider=({children})=>{
  const [state, dispatch] = React.useReducer(Postreducer, initial)
  return (
      <PostContextt.Provider value={{isfetchingposts:state.isfetchingposts,isfetchingprofile:state.isfetchingprofile,dispatch}}>
{children}
      </PostContextt.Provider>

  )
}