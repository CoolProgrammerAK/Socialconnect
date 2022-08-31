import { ClickAwayListener, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { logoutCall } from "../../profilecalls";

import "./drawer.scss";
function Drawer({ open, setopen, user }) {
    
  const PF = process.env.REACT_APP_AVATAR;
  return (
    
    <ClickAwayListener onClickAway={() => setopen(false)}>
      <div className="sideNav">
        <IconButton
          onClick={() => setopen(false)}
          style={{ alignSelf: "flex-end",position:'absolute' }}
        >
          <Close className="closebtn"></Close>
        </IconButton>
        <div className="sideNavMiddle" >
       
          <img
            src={
              user.profilePicture
                ? user.profilePicture
                : PF + "person/noAvatar.png"
            }
            className="drawerImg"
            alt=""
          ></img>
          <h2 className="drawerHeading">Welcome , {user.username}</h2>
        </div>
        <div className="drawerContainer">
        <Link to={`/profile/${user._id}`} className="drawerNavigation">
          <p> Profile</p>
          </Link>
          <Link to={`/edit/${user._id}`} className="drawerNavigation">
          <p>Edit</p>
          </Link>
         
          <p className="drawerNavigation" onClick={()=>logoutCall()}>Logout</p>
         
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default Drawer;
