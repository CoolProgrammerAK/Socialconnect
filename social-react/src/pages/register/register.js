import React from "react";
import "./register.scss";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { registerCall } from "../../apicalls";
import { AuthContextt } from "../../context/Auth/AuthContext";
import CircularLoading from "../../components/loading/loading2";
import { Redirect } from "react-router";
import Recaptcha from "react-recaptcha";
import ToastContainer from "../../components/toast/toastContainer";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { showtoasterror } from "../../components/toast/toast";

export default function Register() {
  const email = React.useRef();
  const password = React.useRef();
  const confirmpassword = React.useRef();
  const username = React.useRef();
  const [error, seterror] = React.useState("");
  const { isFetching, dispatch } = React.useContext(AuthContextt);
  const [verified, setverified] = React.useState(false);
  const [toggle, settoggle] = React.useState(false);
  let recaptchaInstance;
  React.useEffect(() => {
    seterror("")
  }, [email.current?.value,password.current?.value,username.current?.value,confirmpassword.current?.value])
  const handleclick = async (e) => {
    e.preventDefault();
    seterror("")
    if (verified) {
   
      resetRecaptcha()
      await registerCall(
        {
          email: email.current.value,
          password: password.current.value,
          username: username.current.value,
          confirmpassword: confirmpassword.current.value,
        },
        dispatch,seterror,email,password,confirmpassword,username,setverified
      );
    } else {
      seterror("Please verify that you are a human");
    }
  };

  const resetRecaptcha = () => {
    recaptchaInstance.reset();
  };
  var callback = function () {
    console.log("Done!!!!");
  };
  var verifyCallback = function (response) {
    console.log(response);
    setverified(true);
  };
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
  if (localStorage.getItem("token")) {
    return <Redirect to="/"></Redirect>;
  }
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Socialconnect</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Socialconnect.
          </span>
        </div>
        <ToastContainer></ToastContainer>
        <form className="loginRight" onSubmit={handleclick}>
          <div className="loginBox">
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
            <div className="loginInput">
              <input
                placeholder="Confirm Password"
                required
                minLength="6"
                ref={confirmpassword}
                type="password"
                className="loginInputField"
              ></input>
            </div>
            <div className="loginInput">
              <input
                placeholder="Username"
                required
                minLength="1"
                ref={username}
                type="text"
                className="loginInputField"
              ></input>
            </div>
            {error && (
              <div className="loginError">
                <span> {error} </span>
              </div>
            )}
            <Recaptcha
              sitekey="6LdbraMcAAAAAOli3i6P-QaekyyswDVvdo_XcM6S"
              render="explicit"
              ref={(e) => (recaptchaInstance = e)}
              verifyCallback={verifyCallback}
              onloadCallback={callback}
            />
            <button className="loginButton" disabled={isFetching.register}>
              {isFetching.register ? (
                <CircularLoading colors="red" size={true}></CircularLoading>
              ) : (
                "Sign Up"
              )}
            </button>

            <Link to="/login">
              {" "}
              <button className="loginRegisterButton">
                {" "}
                Already have a account{" "}
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
