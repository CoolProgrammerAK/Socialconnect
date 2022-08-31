import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import './reset.scss'
import { newpassword } from "../../apicalls";
import CircularLoading from "../../components/loading/loading2";
import "react-toastify/dist/ReactToastify.css";
import ToastContainer from "../../components/toast/toastContainer";

function ResetPassword(props) {
  const password = React.useRef();
  const confirmpassword = React.useRef();
  const [toggle, settoggle] = React.useState(false);
  const [error,seterror]=React.useState("")
  const [resetloading,setresetloading]=React.useState(false)
  React.useEffect(() => {
    if (props.match.params.token.length != 64) {
      window.location.pathname = "/page-not-found";
    }
  }, props.match.params.token);
  
  React.useEffect(() => {
    seterror("")
  }, [confirmpassword.current?.value,password.current?.value]) 

  const toggleicon = (e) => {
    
    e.preventDefault();
    settoggle(!toggle);
    if (!toggle) {
      password.current.type = "text";
      confirmpassword.current.type = "text";
    } else {
      password.current.type = "password";
      confirmpassword.current.type = "password";
    }
  };

  const resetsubmit=async(e)=>{
     e.preventDefault()
     seterror("")
     await newpassword({
      password: password.current.value,
      confirmpassword: confirmpassword.current.value,
      token:props.match.params.token
    },seterror,password,confirmpassword,setresetloading)
  }
  return (
    <div className="resetBox">
      <ToastContainer></ToastContainer>
      <h1 className="resetHeading">Reset your password</h1>
      <form className="resetForm" onSubmit={resetsubmit}>
        <div className="resetInput">
          <input
            placeholder="Enter your new password"
            required
            ref={password}
            type="password"
            className="loginInputField"
          />
          {!toggle ? (
            <VisibilityIcon
              className="loginIcon"
              onClick={toggleicon}
            ></VisibilityIcon>
          ) : (
            <VisibilityOffIcon
              className="loginIcon"
              onClick={toggleicon}
            ></VisibilityOffIcon>
          )}
        </div>

        <div className="resetInput">
          <input
            placeholder="Confirm your new password"
            required
            ref={confirmpassword}
            type="password"
            className="loginInputField"
          />
        </div>
        {error && (
              <div className="loginError">
                <span> {error} </span>
              </div>
            )}
        <button className="resetButton" type="submit" disabled={resetloading}>
              {resetloading ? (
                <CircularLoading colors="red" size={true}></CircularLoading>
              ) : (
                "Submit"
              )}
            </button>
     
      </form>
    </div>
  );
}

export default ResetPassword;
