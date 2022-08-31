import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import "./forgotpass.scss";
import CircularLoading from "../loading/backdrop";
import { resetEmail } from "../../apicalls";
function Forgotpassword({ open, setopen }) {
  const [changeloader, setchangeloader] = React.useState(false);
  const email = React.useRef();

  const sendtoken = async (e) => {
    e.preventDefault();
    setchangeloader(true);

    var data = {
      email: email.current?.value,
    };
    await resetEmail(data);
    email.current.value = "";
    setopen(false)
    setchangeloader(false);
  };
  return (
    <Dialog
      open={open}
      onClose={() => setopen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {"Forgot your password ?"}
      </DialogTitle>
      <DialogContent>
        <form id="myform" >
          <div className="changePasswordInput loginInput">
            <input
              placeholder="Enter your email"
              required
              ref={email}
              type="email"
              className="changePasswordField loginInputField"
            ></input>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setopen(false)} color="primary">
          Close
        </Button>
        <button
        onClick={sendtoken}
          disabled={changeloader}
          type="submit"
          form="myform"
          className="changeButtonStyle"
        >
          {changeloader ? (
            <CircularLoading />
          ) : (
            <span style={{ fontSize: 15 }}>Submit</span>
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default Forgotpassword;
