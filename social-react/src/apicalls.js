
import {showtoasterror,showtoastsuccess} from './components/toast/toast'
import { LoginStart, LoginSuccess, RegisterStart } from './context/Auth/AuthActions';

export const loginCall = async (userCredientials, dispatch,set,setverified,email,password) => {
  dispatch(LoginStart());

  fetch("/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userCredientials),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.error) {
        
        setverified(false)
        email.current.value=""
        password.current.value=""
        dispatch(LoginSuccess(data.user));
        localStorage.setItem("token", data.token)
        window.location.pathname="/"

      } else {
        dispatch({ type: "DONE" });
 
        set(data.error)

      }
    })
    .catch((error) => {
      dispatch({ type: "DONE" });
   
     console.log(error.message)
    });
};

export const registerCall = async (userCredientials, dispatch,set,email,password,confirmpassword,username,setverified) => {
  dispatch(RegisterStart());

  fetch("/auth/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userCredientials),
  })
    .then((res) => res.json())
    .then((data) => {

      dispatch({ type: "DONE" });
      if (!data.error) {
        
        setverified(false)
        confirmpassword.current.value=""
        username.current.value=""
        email.current.value=""
        password.current.value=""
        showtoastsuccess(data.msg)
      } else {
        set(data.error)
      }
    })
    .catch((error) => {
      dispatch({ type: "DONE" });
      console.log(error.message)
    });
};

export const resetEmail = async (data) => {
  fetch("/auth/reset-password", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status==200) {
        showtoastsuccess(data.msg)
      } else {
        showtoasterror(data.msg)
      }
    })
    .catch((error) => {
      console.log(error)
    });
};

export const newpassword = async (userCredientials, seterror,password,confirmpassword,setloading) => {
  setloading(true)
  fetch("/auth/new-password", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userCredientials),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status==200) {
        showtoastsuccess(data.msg)
        
        confirmpassword.current.value=""
        password.current.value=""
       console.log(data.msg)
      } else {
 
        seterror(data.msg)

      }
    })
    .catch((error) => {
   
     console.log(error.message)
    }).finally(()=>{
      setloading(false)
    });
};