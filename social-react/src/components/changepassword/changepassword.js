import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import "./changepassword.scss";
import { changeaccount } from "../../profilecalls";
import { AuthContextt } from "../../context/Auth/AuthContext";
import CircularLoading from "../loading/backdrop";
function Changepassword({ open, setopen, change }) {
  const { user } = React.useContext(AuthContextt);
  const oldpassword = React.useRef();
  const password = React.useRef();
  const [changeloader, setchangeloader] = React.useState(false);
  const confirmpassword = React.useRef();
  const confirmation = React.useRef();
  const [toggle, settoggle] = React.useState(false);

  const toggleicon = (e) => {
    e.preventDefault();
    settoggle(!toggle);
    if (!toggle) {
      oldpassword.current.type = "text";
      password.current.type = "text";
      confirmpassword.current.type = "text";
    } else {
      oldpassword.current.type = "password";
      password.current.type = "password";
      confirmpassword.current.type = "password";
    }
  };
  const toggleicon2 = (e) => {
    e.preventDefault();
    settoggle(!toggle);
    if (!toggle) {
      confirmation.current.type = "text";
    } else {
      confirmation.current.type = "password";
    }
  };
  const uploadfunction = async (f, e) => {
    e.preventDefault();
    var data = {};
    var handler = {};
    setchangeloader(true)
    if (f == "change") {
      data = {
        password: oldpassword.current?.value,
        newpassword: password.current?.value,
        confirmnewpassword: confirmpassword.current?.value,
      };
      handler = {
        setopen: setopen,
      };
      await changeaccount(data, true, user, handler);
      oldpassword.current.value = "";
      password.current.value = "";
      confirmpassword.current.value = "";
    }
    if (f == "delete") {
      data = {
        password: confirmation.current?.value,
      };
      handler = {
        setopen: setopen,
      };
      await changeaccount(data, false, user, handler);
      confirmation.current.value = "";
    }
     setchangeloader(false)
  };
  return (
    <Dialog
      open={open}
      onClose={() => setopen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {change ? "Change your password" : "Confirmation"}

       
      </DialogTitle>
      {change ? (
        <DialogContent>
          <form id="myform" onSubmit={(e) => uploadfunction("change", e)}>
            <div className="changePasswordInput loginInput">
              <input
                placeholder="Enter your Password"
                required
                minLength="6"
                ref={oldpassword}
                type="password"
                className="changePasswordField loginInputField"
              ></input>
              {!toggle ? (
                <Visibility
                  className="changePasswordIcon"
                  onClick={toggleicon}
                ></Visibility>
              ) : (
                <VisibilityOff
                  className="changePasswordIcon"
                  onClick={toggleicon}
                ></VisibilityOff>
              )}
            </div>
            <div className="changePasswordInput loginInput">
              <input
                placeholder="Enter your New Password"
                required
                minLength="6"
                ref={password}
                type="password"
                className="changePasswordField loginInputField"
              ></input>
            </div>
            <div className="changePasswordInput loginInput">
              <input
                placeholder="Confirm your new Password"
                required
                minLength="6"
                ref={confirmpassword}
                type="password"
                className="changePasswordField loginInputField"
              ></input>
            </div>
          </form>
        </DialogContent>
      ) : (
        <DialogContent>
          <form id="myform" onSubmit={(e) => uploadfunction("delete", e)}>
            <div className="changePasswordInput loginInput">
              <input
                placeholder="Confirm your Password"
                required
                minLength="6"
                ref={confirmation}
                type="password"
                className="changePasswordField loginInputField"
              ></input>
              {!toggle ? (
                <Visibility
                  className="changePasswordIcon"
                  onClick={toggleicon2}
                ></Visibility>
              ) : (
                <VisibilityOff
                  className="changePasswordIcon"
                  onClick={toggleicon2}
                ></VisibilityOff>
              )}
            </div>
          </form>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={() => setopen(false)} color="primary">
          Close
        </Button>
        <button
          disabled={changeloader}
          type="submit"
          form="myform"
          className="changeButtonStyle"
        >
          {changeloader ? (
            <CircularLoading/>
          ) : (
            <span style={{ fontSize: 15 }}>
              {change ? "Confirm" : "Delete your account"}
            </span>
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default Changepassword;
