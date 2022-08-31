import React from "react";
import "./toolbar.scss";
import MoreIcon from "@material-ui/icons/MoreVert";
import MenuIcon from "@material-ui/icons/Menu";
import {
  MenuItem,
  ListItemText,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Link,useHistory } from "react-router-dom";
import {
  Chat,
  Person,
  Search,
  Notifications,
  ArrowDropDown,
} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AuthContextt } from "../../context/Auth/AuthContext";
import { fetchallusers, logoutCall } from "../../profilecalls";
import Drawer from "./drawer";
import { NotificationContextt } from "../../context/Notification/notificationcontext";
import {readingNotification} from "../../context/Notification/Notificationaction";
import MenuDropdown from "../menu/menu";
import moment from "moment";

export default function Toolbar({allUsers}) {
  const history=useHistory()
  const { user } = React.useContext(AuthContextt);
  const { notifications,dispatch } = React.useContext(NotificationContextt);
  const PF = process.env.REACT_APP_AVATAR;
  const [anchorEl, setAnchorE1] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);
  const [anchorE4, setAnchorE4] = React.useState(null);
  const [opendrawer, setopendrawer] = React.useState(false);
  const [chatnotification, setchatnotification] = React.useState([]);
  const [likecommentnotification, setlikecommentnotification] = React.useState(
    []
  );
  const [likecommentunreadnotification, setlikecommentunreadnotification] = React.useState(
   0
  );
  const [follownotification, setfollownotification] = React.useState(
    []
  );
  const [followunreadnotification, setfollowunreadnotification] = React.useState(
   0
  );
  const handleClick = (event, set) => {
    set(event.currentTarget);
  };
  const handleClick2 = async(event, set,t,f="") => {
    set(event.currentTarget);
    await readingNotification(dispatch,t,f)

  };
  // React.useEffect(() => {
  //   fetchallusers(seterror,user._id,setallUsers)
  // }, []);
  React.useEffect(() => {
    setopendrawer(false);
    setAnchorE1(null);
    setAnchorE2(null);
    setAnchorE3(null);
    setAnchorE4(null);
  }, []);
  React.useEffect(() => {
    if (notifications.length > 0) {
      setlikecommentnotification(
        notifications.filter((notify) => (notify.notificationType == "Like") || (notify.notificationType == "Comment"))
      );
      setlikecommentunreadnotification(
        notifications.filter((notify) => ((notify.notificationType == "Like") || (notify.notificationType == "Comment")) && (notify.read==false)).length
      );
      setfollownotification(
        notifications.filter((notify) => notify.notificationType == "Follow")
      );
      setfollowunreadnotification(
        notifications.filter((notify) => notify.notificationType == "Follow" && notify.read==false).length
      );
      setchatnotification(
        notifications.filter((notify) => notify.notificationType == "Chat")
      );
      // console.log(likecommentnotification,likecommentunreadnotification,chatnotification)
    } else {
      setlikecommentnotification([]);
      setchatnotification([]);
      setfollownotification([])
      setfollowunreadnotification(0)
      setlikecommentunreadnotification(0)
    }
  }, [notifications]);
  const handleclick = async (user) => {
    history.push(`/profile/${user._id}`)
  };
  return (
    <>
      {opendrawer && (
        <Drawer open={opendrawer} setopen={setopendrawer} user={user}></Drawer>
      )}
      <div className="topBarContainer">
        <div className="topBarLeft">
          <IconButton onClick={() => setopendrawer(true)}>
            <MenuIcon className="menuIcon icon" size={36}></MenuIcon>
          </IconButton>
          <Link to="/" style={{ textDecoration: "none" }}>
            {" "}
            <span className="logo"> Socialconnect</span>
          </Link>
        </div>
        <div className="topBarBox">
          <div className="topBarCenter">
            <div className="searchbar" style={{width:'-webkit-fill-available'}}>
              {/* <Search className="searchIcon"></Search> */}

              {/* <input
                placeholder="Search for any friend or user"
                className="searchInput"
              ></input> */}
              {allUsers?.length > 0 ?  <Autocomplete
               id="grouped-demo"
               groupBy={(option) => option.username[0]}
              autoComplete
              className="searchInput"
              getOptionSelected={(option, value) => option === value}
              getOptionLabel={(option) => option.username}
              onChange={(option, value) => handleclick(value)}
              options={allUsers.length > 0 ? allUsers.sort((a, b) => -b.username.localeCompare(a.username)) : ["No users found"]}
              renderInput={(params) => (
                <TextField
                {...params}
                placeholder="Search for any friend or user"
                
              ></TextField>
              )}
            />:
            <Autocomplete
            id="grouped-demo"
           className="searchInput"
         
           options={["No users found"]}
           renderInput={(params) => (
             <TextField
             {...params}
             placeholder="Search for any friend or user"
             
           ></TextField>
           )}
         />}
              
            </div>
          </div>
          <div className="topBarRight">
            <div className="topBarLinks">

              <div  className="topBarLink">
              <Link to="/">
                Home 
                
              </Link>
                </div>
              <div className="topBarLink">
              <Link to="/messenger">
                Chat
                </Link>
                </div>
          
            </div>

            <div className="topBarIcons margin2">
              <div className="topBarIcon">
                <Person className="icon big"  onClick={(e) => handleClick2(e, setAnchorE4,"Follow")}></Person>
                {followunreadnotification > 0 && (
                  <span className="topBarIconBadge">
                    {followunreadnotification}
                  </span>
                )}

                <MenuDropdown anchor={anchorE4} setanchor={setAnchorE4}>
                  {follownotification.length > 0 ? (
                   follownotification.map((notification) => {
                      return (
                        <MenuItem selected={false} key={notification._id} className={notification.read?"readed":"toread"}>
                          <Link
                            to={`/profile/` + notification.sender._id}
                            className="linkNavigation flexAlign"
                          >
                            <div>
                              <img
                                src={
                                  notification.sender.profilePicture
                                    ? notification.sender.profilePicture
                                    : PF + "person/noAvatar.png"
                                }
                                className="topBarImg"
                                alt=""
                              ></img>
                            </div>
                            <div>
                                <strong>
                                  {notification.sender.username}
                                  {" started following you   "}
                                </strong>
                              
                            </div>

                            <div
                              style={{ padding: "0px 0px 0px 10px " }}
                            >
                              {"  "}
                              {moment(notification.time).fromNow()}
                            </div>
                          </Link>
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem>
                      <p>No New messages</p>
                    </MenuItem>
                  )}
                </MenuDropdown>
              </div>

              <div className="topBarIcon">
                <Chat
                  className="icon big"
                  onClick={(e) => handleClick(e, setAnchorE2)}
                ></Chat>
                {chatnotification.length > 0 && (
                  <span className="topBarIconBadge">
                    {chatnotification.length}
                  </span>
                )}

                <MenuDropdown anchor={anchorE2} setanchor={setAnchorE2}>
                  {chatnotification.length > 0 ? (
                    chatnotification.map((notification) => {
                      return (
                        <MenuItem key={notification._id} className="toread">
                          <Link
                            to={`/profile/` + notification.sender._id}
                            className="linkNavigation flexAlign"
                          >
                            <div>
                              <img
                                src={
                                  notification.sender.profilePicture
                                    ? notification.sender.profilePicture
                                    : PF + "person/noAvatar.png"
                                }
                                className="topBarImg"
                                alt=""
                              ></img>
                            </div>
                            <div>
                              <strong>
                                {notification.sender.username +
                                  " sends a message   "}
                              </strong>
                            </div>

                            <div
                              style={{ padding: "0px 0px 0px 10px " }}
                            >
                              {"  "}
                              {moment(notification.time).fromNow()}
                            </div>
                          </Link>
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem>
                      <ListItemText primary="No New messages" />
                    </MenuItem>
                  )}
                </MenuDropdown>
              </div>

              <div className="topBarIcon">
                <Notifications
                  onClick={(e) => handleClick2(e, setAnchorE3,"Like","Comment")}
                  className="icon big"
                ></Notifications>
                {likecommentunreadnotification > 0 && (
                  <span className="topBarIconBadge">
                    {likecommentunreadnotification}
                  </span>
                )}

                <MenuDropdown anchor={anchorE3} setanchor={setAnchorE3}>
                  {likecommentnotification.length > 0 ? (
                    likecommentnotification.map((notification) => {
                      return (
                        <MenuItem key={notification._id} className={notification.read?"readed":"toread"}>
                          <Link
                            to={`/profile/` + notification.sender._id}
                            className="linkNavigation flexAlign"
                          >
                            <div>
                              <img
                                src={
                                  notification.sender.profilePicture
                                    ? notification.sender.profilePicture
                                    : PF + "person/noAvatar.png"
                                }
                                className="topBarImg"
                                alt=""
                              ></img>
                            </div>
                            <div style={{flexGrow:1}}>
                              {notification.notificationType == "Like" ? (
                                <strong>
                                  {notification.sender.username}
                                  {" likes your photo   "}
                                </strong>
                              ) : (
                                <strong>
                                  {notification.sender.username}
                                  {" commented on your photo   "}
                                </strong>
                              )}
                            </div>

                            <div
                              style={{ padding: "0px 0px 0px 10px " }}
                            >
                              {"  "}
                              {moment(notification.time).fromNow()}
                            </div>
                          </Link>
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem>
                      <ListItemText primary="No New messages" />
                    </MenuItem>
                  )}
                </MenuDropdown>
              </div>
            </div>
            <div className="imgContainer">
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                className="topBarImg"
                alt=""
              ></img>
              <span
                onClick={(e) => handleClick(e, setAnchorE1)}
                className="profileName"
              >
                Welcome, {user.username}{" "}
              </span>
              <ArrowDropDown
                onClick={(e) => handleClick(e, setAnchorE1)}
                className="icon"
              ></ArrowDropDown>
              <MenuDropdown anchor={anchorEl} setanchor={setAnchorE1}>
                <MenuItem>
                  <Link to={`/profile/${user._id}`} className="linkNavigation textCe">
                    <ListItemText primary="Profile" />
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link to={`/edit/${user._id}`} className="linkNavigation textCe">
                    <ListItemText primary="Edit" />
                  </Link>
                </MenuItem>
                <MenuItem>
                  <ListItemText className="linkNavigation textCe" onClick={() => logoutCall()} primary="Logout" />
                </MenuItem>
              </MenuDropdown>
            </div>
          </div>

          <div className="topBarRightMob">
            <MoreIcon className="icon"></MoreIcon>
          </div>
        </div>
      </div>
    </>
  );
}
