import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import './backdrop.css'
import CircularProgress from '@material-ui/core/CircularProgress';


export default function SimpleBackdrop() {
  

  return (
    <div className="zindex">
      <Backdrop className="backdrop" open={true} >
        <div className="loading"></div>
      </Backdrop>
    </div>
  );
}
