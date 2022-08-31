import React, { useContext } from "react";
import "../register/register.scss";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { loginCall } from "../../apicalls";
import { AuthContextt } from "../../context/Auth/AuthContext";
import { Link } from "react-router-dom";
import Recaptcha from "react-recaptcha";
import { Redirect } from "react-router";
import ToastContainer from "../../components/toast/toastContainer";
import "react-toastify/dist/ReactToastify.css";
import CircularLoading from "../../components/loading/loading2";
import Forgotpassword from "../../components/forgotpassword/forgotpass";

export default function Login() {
  const email = React.useRef();
  const password = React.useRef();
  const [error, seterror] = React.useState("");
  const [verified, setverified] = React.useState(false);
  const [toggle, settoggle] = React.useState(false);
  const { isFetching, dispatch } = useContext(AuthContextt);
  const [open, setopen] = React.useState(false);
  let recaptchaInstance;
  
  React.useEffect(() => {
    seterror("")
  }, [email.current?.value,password.current?.value])


  const handleclick = async (e) => {
    e.preventDefault();
     seterror("")
    if (verified) {
     
      resetRecaptcha()
      await loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch,
        seterror,setverified,email,password
      );
    } else {
      seterror("Please verify that you are a human");
    }
  };

  const resetRecaptcha = () => {
    recaptchaInstance.reset();
  };
// console.log(recaptchaInstance)
  const toggleicon = (e) => {
    e.preventDefault();
    settoggle(!toggle);
    if (!toggle) {
      password.current.type = "text";
    } else {
      password.current.type = "password";
    }
  };
  var callback = function () {
    console.log("Done!!!!");
  };
  var verifyCallback = function (response) {
    console.log(response);
    setverified(true);
    seterror("")
  };
  if (localStorage.getItem("token")) {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h4 className="loginLogo">Socialconnect</h4>
          <span className="loginDesc">
            Connect with friends and the world around you on Socialconnect.
          </span>
        </div>
        <ToastContainer></ToastContainer>
        <div className="loginRight">
          <form className="loginBox loginBox2" onSubmit={handleclick}>
            <div className="loginInput">
              <input
                placeholder="Email"
                required
                ref={email}
                type="email"
                className="loginInputField"
              />
            </div>

            <div className="loginInput">
              <input
                placeholder="Password"
                required
                minLength="6"
                ref={password}
                type="password"
                className="loginInputField"
              ></input>
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
            {open && (
              <Forgotpassword open={open} setopen={setopen}></Forgotpassword>
            )}
            {error && (
              <div className="loginError">
                <span> {error} </span>
              </div>
            )}
            <div className="loginForgot">
              <span style={{ cursor: "pointer" }} onClick={() => setopen(true)}>
                {" "}
                Forgot Password?{" "}
              </span>
            </div>
            <Recaptcha
              sitekey="6LdbraMcAAAAAOli3i6P-QaekyyswDVvdo_XcM6S"
              render="explicit"
              ref={(e) => (recaptchaInstance = e)}
              verifyCallback={verifyCallback}
              onloadCallback={callback}
            />
            <button className="loginButton" disabled={isFetching.login}>
              {isFetching.login ? (
                <CircularLoading colors="red" size={true}></CircularLoading>
              ) : (
                "Log In"
              )}
            </button>
            <button className="loginRegisterButton">
              <Link to="/register"> Create a New Account</Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
