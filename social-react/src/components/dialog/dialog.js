import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularLoading from "../loading/loading2";

export default function AlertDialog({ open ,setopen,deletefunction,loading}) {
   const handleClose=()=>{
         setopen(false)
    }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose} color="primary">
            Close
          </Button>
          <Button variant="contained" disabled={loading}  onClick={deletefunction} color="secondary" autoFocus>
          
            {loading ? (
               <CircularLoading colors="red"></CircularLoading>
              ) : (
                <span style={{ fontSize: 15 }}>Delete</span>
              )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
