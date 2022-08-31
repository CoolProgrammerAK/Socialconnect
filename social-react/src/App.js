import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Register from "./pages/register/register";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "emoji-mart/css/emoji-mart.css";
import React, { useContext, useEffect } from "react";
import Messenger from "./pages/messenger/messenger";
import Editprofile from "./pages/editProfile/Editprofile";
import socketconnection from "./socketconnection";
import { AuthContextt } from "./context/Auth/AuthContext";
import { OnlineContextt } from "./context/Online/onlinecontext";
import { Onlineusers } from "./context/Online/onlineaction";
import { fetchingnotification } from "./conversationcalls";
import { NotificationContextt } from "./context/Notification/notificationcontext";
import {
  postNotification,
  removingNotification,
} from "./context/Notification/Notificationaction";
import { fetchallusers } from "./profilecalls";
import ResetPassword from "./pages/resetpassword/reset";
import Notfound from "./components/notfound/notfound";
function App() {
  var token = localStorage.getItem("token");
  const { user } = useContext(AuthContextt);
  const { dispatc } = useContext(OnlineContextt);
  const [allUsers, setallUsers] = React.useState([]);
  const [error, seterror] = React.useState(null);
  const [arrivalmessage, setarrivalmessage] = React.useState(null);
  const [arrivalLikeComment, setarrivalLikeComment] = React.useState(null);
  const [deleteLikeComment, setdeleteLikeComment] = React.useState(null);
  const [arrivalfollow, setarrivalfollow] = React.useState(null);
  const [deletefollow, setdeletefollow] = React.useState(null);
  const [currentchat, setcurrentchat] = React.useState(null);
  const { dispatch, fetchnotification, notifications } =
    useContext(NotificationContextt);

  useEffect(() => {
    socketconnection.emit("addUser", user?._id);
    socketconnection.on("getUsers", (users) => {
      dispatc(
        Onlineusers(
          user
            ? user?.following?.filter((f) => users.some((u) => u.userid === f))
            : [],
          users
        )
      );
    });
    user &&
      socketconnection.on("getmessage", (data) => {
        setarrivalmessage({
          sender: data.senderId,
          message: data.text,
          time: new Date().toUTCString(),
        });
      });
    user &&
      socketconnection.on("sendLikeComment", (data) => {
        setarrivalLikeComment({
          sender: data.senderId,
          time: new Date().toUTCString(),
          postId:data.postId,
          type:data.type
        });
      });
    user &&
      socketconnection.on("removeLikeComment", (data) => {
        setdeleteLikeComment({
          sender: data.senderId,
          type: data.type, postId:data.postId
        });
      });

      user &&
      socketconnection.on("follow", (data) => {
        setarrivalfollow({
          sender: data.senderId,
          time: new Date().toUTCString()
        });
      });
    user &&
      socketconnection.on("removefollow", (data) => {
        setdeletefollow({
          sender: data.senderId,
          type: data.type
        });
      });
  }, [user]);

  useEffect(() => {
    user && fetchingnotification(user._id, dispatch);
  }, [user, fetchnotification]);

  useEffect(() => {
    arrivalLikeComment &&
      postNotification(
        arrivalLikeComment.sender,
        user._id,
        dispatch,
        arrivalLikeComment.type,arrivalLikeComment.postId
      );
  }, [arrivalLikeComment]);
  useEffect(() => {
    // console.log(deleteLikeComment)
    deleteLikeComment &&
      removingNotification(
        deleteLikeComment.sender,
        dispatch,
        user._id,
        deleteLikeComment.type,deleteLikeComment.postId
      );
  }, [deleteLikeComment]);

  useEffect(() => {
    arrivalfollow &&
      postNotification(
        arrivalfollow.sender,
        user._id,
        dispatch,
        "Follow"
      );
  }, [arrivalfollow]);
  useEffect(() => {
    deletefollow &&
      removingNotification(
        deletefollow.sender,
        dispatch,
        user._id,
        deletefollow.type
      );
  }, [deletefollow]);
  
   useEffect(() => {
    fetchallusers(seterror,user?._id,setallUsers)
  }, []);
console.log(allUsers)
  useEffect(() => {
    arrivalmessage &&
      !currentchat?.members?.includes(arrivalmessage.sender) &&
      postNotification(arrivalmessage.sender, user._id, dispatch, "Chat");
  }, [arrivalmessage]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          {token ? <Home allUsers={allUsers}></Home> : <Redirect to="/login" />}
        </Route>
        <Route path="/login" exact>
          {!token ? <Login></Login> : <Redirect to="/" />}
        </Route>
        <Route path="/register" exact>
          {!token ? <Register></Register> : <Redirect to="/" />}
        </Route>
        <Route path="/messenger" exact>
          {token ? (
            <Messenger
            allUsers={allUsers}
              arrivalmessage={arrivalmessage}
              currentchat={currentchat}
              setcurrentchat={setcurrentchat}
            />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route
          path="/profile/:userid"
          exact
          render={(props) =>token ? (
            <Profile
            allUsers={allUsers}
             {...props}
            />
          ) : (
            <Redirect to="/" />
          )}
        >
           
        </Route>
        <Route
          path="/edit/:userid"
          exact
          render={(props) =>token ? (
            <Editprofile
            allUsers={allUsers}
             {...props}
            />
          ) : (
            <Redirect to="/" />
          )}></Route>
        <Route
          path="/reset/:token"
          exact
          component={!token ? ResetPassword : Login}
        ></Route>
          <Route
          path="*"
          exact
          
        >
<Notfound error={true}></Notfound>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
