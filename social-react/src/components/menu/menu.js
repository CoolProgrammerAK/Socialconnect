import React from 'react'
import { Menu } from "@material-ui/core";
export default function MenuDropdown({children,anchor,setanchor}) {
 

  const handleClose = () => {
    setanchor(null);
  };
    return (
       <Menu  
       id="simple-menu"
       
       anchorEl={anchor}
       open={Boolean(anchor)}
       onClose={handleClose}
       elevation={0}
       getContentAnchorEl={null}
       anchorOrigin={{
         vertical: "bottom",
         horizontal: "center",
       }}
       transformOrigin={{
         vertical: "top",
         horizontal: "center",
       }}
       >
         {children}
       </Menu>
    )
}
