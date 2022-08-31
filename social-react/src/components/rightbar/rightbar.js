import React, { useContext } from "react";
import "./rightbar.scss";
import moment from 'moment'
import { AuthContextt } from "../../context/Auth/AuthContext";
import { Link } from "react-router-dom";
import ChatOnline from "../chatOnline/chatOnline";
import { fetchfriendscall, followCall } from "../../profilecalls";
import CircularLoading from "../loading/loading2";
import { OnlineContextt } from "../../context/Online/onlinecontext";
import socketconnection from "../../socketconnection";
import { removingNotification } from "../../context/Notification/Notificationaction";
import { NotificationContextt } from "../../context/Notification/notificationcontext";
import { addingNotification } from "../../conversationcalls";
function Rightbar({ cuser, load,allUsers }) {
  const { user } = React.useContext(AuthContextt);
  const [friends, setfriends] = React.useState([]);
  const [follow, setfollow] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const {onlineusers} = useContext(OnlineContextt)
  const { allonlineusers } = React.useContext(OnlineContextt);
  const { dispatch } = React.useContext(NotificationContextt);

  React.useEffect(() => {
    setfollow(user.following.includes(cuser?._id));
  }, [user, cuser?._id]);

  React.useEffect(() => {
   cuser && fetchfriendscall(cuser, setfriends);
  }, [cuser?._id]);

  function Homerightbar() {
    const PF = process.env.REACT_APP_AVATAR;

    return (
      <>
        <div className="rightbarH">
          <div className="rightbarWrapper">
            {/* <div className="birthdayContainer">
              <img className="birthdayImg" src={PF + "gift.png"} alt="" />
              {
                friends.length>0 && friends.map(friend=>{

                })
              }
              <span className="birthdayText">
                <b>Pola Foster</b> and <b>3 other friends</b> have a birthday
                today.
              </span>
            </div> */}
            <img className="rightbarAd" src={PF + "ad1.jpg"} alt="" />
             <ChatOnline onlineusers={onlineusers} currentuser={user} rightbar={true}></ChatOnline>
          </div>
        </div>
      </>
    );
  }
  const handleclick = async (e) => {
    e.preventDefault();
    var data = {
      cuser: cuser,
      follow: follow,
      setloading: setloading,
      setfollow: setfollow,
    };
   await followCall(data);
   if (cuser._id != user._id) {
    if (!follow) {
      if (
        !(
          allonlineusers.length > 0 &&
          allonlineusers.some((item) => item.userid === cuser._id)
        )
      ) {
        await addingNotification(user._id, cuser._id, "Follow");
      } else {
        socketconnection.emit("follow", {
          senderId: user._id,
          receiverId: cuser._id
        });
      }
    } else {
      if (
        !(
          allonlineusers.length > 0 &&
          allonlineusers.some((item) => item.userid === cuser._id)
        )
      ) {
        await removingNotification(user._id, dispatch,cuser._id,  "Follow");
      } else {
        socketconnection.emit("removefollow", {
          senderId: user._id,
          receiverId: cuser._id,type:"Follow"
        });
      }
    }
  }
  };
  function Profilerightbar() {
    const PF = process.env.REACT_APP_AVATAR;

    return (
      <>
        <div className="rightbarP">
          <div className="rightbarWrapper">
            {!load
              ? user._id !== cuser._id && (
                  <button
                    className="rightbarFollowButton"
                    onClick={handleclick}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularLoading colors="#1872f2"></CircularLoading>
                    ) : follow ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </button>
                )
              : null}

            <h4 className="rightbarTitle">User Information</h4>
            <div className="rightbarInfo">
              <div className="rightbarInfoItem">
                <span className="rightbarInfoItemKey">DOB:</span>
                <span className="rightbarInfoItemValue">
                  {!load && cuser.dob!=""? cuser.dob? moment(cuser.dob).format('MMMM Do YYYY'):"-" : ""}
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoItemKey">City:</span>
                <span className="rightbarInfoItemValue">
                  {!load && cuser.city!=""? cuser.city ?? "-" : "-"}
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoItemKey">From:</span>
                <span className="rightbarInfoItemValue">
                  {!load && cuser.from!=""? cuser.from ?? "-" : "-"}
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoItemKey">Relationship:</span>
                <span className="rightbarInfoItemValue">
                  {!load && cuser.relationship!=""
                    ? cuser.relationship
                    : ""}
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoItemKey">Contact:</span>
                <span className="rightbarInfoItemValue">
                  {!load && cuser.phone!=""? cuser.phone ?? "-" : "-"}
                </span>
              </div>
            </div>
            {<h4 className="rightbarTitle">User friends</h4>}

            <div className="rightbarFollowings">
              {!load
                ? friends &&
                  friends.map((friend) => {
                    return (
                      <Link
                        to={"/profile/" + friend._id}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <div className="rightbarFollowing" key={friend._id}>
                          <img
                            className="rightbarFollowingImg"
                            src={
                              friend.profilePicture
                                ? friend.profilePicture
                                : PF + "person/noAvatar.png"
                            }
                            alt=""
                            loading="lazy"
                          />
                          <span className="rightbarFollowingName">
                            {friend.username ? friend.username : ""}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {cuser ? (
        <Profilerightbar></Profilerightbar>
      ) : (
        <Homerightbar></Homerightbar>
      )}
    </>
  );
}

export default Rightbar;
