import React from 'react'
import {Dialog,DialogActions,DialogContent,DialogTitle,DialogContentText,TextField,Button} from '@material-ui/core';

function  Changepassword({open,setopen}) {
    return (
        <Dialog open={open} onClose={()=>setopen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setopen(false)} color="primary">
            Cancel
          </Button>
          <Button color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default Changepassword
