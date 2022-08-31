import {toast} from 'react-toastify'

export const showtoasterror=(msg)=>{
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      progress:undefined,
      hideProgressBar: false,
    });
  }
  
 export const showtoastsuccess=(msg)=>{
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      progress:undefined,
      hideProgressBar: false,
    });
  }

