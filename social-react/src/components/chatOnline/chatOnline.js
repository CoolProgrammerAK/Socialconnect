import React from "react";
import { getspecificconversation } from "../../conversationcalls";
import { fetchfriendscall } from "../../profilecalls";
import "./chatOnline.scss";
import {useHistory} from 'react-router-dom'
export default function ChatOnline({
  onlineusers,
  currentuser,
  setcurrentchat=null,
  setfetchmessages=null,
  rightbar=false,
  setrefreshingconversation=null,refreshingconversation=null
}) {
  const PF = process.env.REACT_APP_AVATAR;
  const [friends, setfriends] = React.useState([]);
  const [onlinefriends, setonlinefriends] = React.useState([]);
 const history=useHistory()
  React.useEffect(() => {
    fetchfriendscall(currentuser, setfriends);
  }, [currentuser]);

  React.useEffect(() => {
  setonlinefriends(friends.filter((f) => onlineusers.includes(f._id)));
  }, [friends, onlineusers]);

  const handleclick=async(user)=>{
    setfetchmessages(true)
   await getspecificconversation(currentuser,setcurrentchat,user,
    setrefreshingconversation,refreshingconversation)
   setfetchmessages(false)
  }
  return (
    <div >
        <h4 className="sidebarTitle">Online Friends</h4>
      {onlinefriends.length>0  &&
        onlinefriends.map((o) => {
        return ( <div className="chatOnlineFriend" key={o._id} onClick={()=>!rightbar?handleclick(o):history.push(`/profile/${o._id}`)}>
            <div className="chatOnlineFriendContainer">
              <img
                className="chatImg"
                src={
                  o.profilePicture
                    ? o.profilePicture
                    : PF + "person/noAvatar.png"
                }
              ></img>
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatText">{o.username}</span>
          </div>);
        })}
    </div>
  );
}
