import React from "react";
import { fetchuser } from "../../profilecalls";
import "./conversations.scss";
import { NotificationContextt } from "../../context/Notification/notificationcontext";
import { Skeleton } from "@material-ui/lab";

export default function Conversation({ conversation, currentuser }) {
  const PF = process.env.REACT_APP_AVATAR;
  const [user, setuser] = React.useState(null);
  const [notification, setnotification] = React.useState(0);
  const { notifications} =   React.useContext(NotificationContextt);
  const [error, seterror] = React.useState(null);
  React.useEffect(() => {
    const friendid = conversation.members.find((m) => m != currentuser._id);
    fetchuser(seterror, friendid, setuser);
  }, [currentuser, conversation]);

  React.useEffect(() => {
   notifications && setnotification(notifications.filter(notification => conversation.members?.includes(notification.sender._id) && notification.notificationType=="Chat" ).length)

  }, [ conversation,notifications]);
  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
         user && user.profilePicture
            ? user.profilePicture
            : PF + "person/noAvatar.png"
        }
      ></img>
      <div className="conversationDetail">
        <span className="conversationText">
           {user && user.username ? user.username : <Skeleton animation="wave" height={15} width="50%" style={{ margin: "6px 0px" }} />}
         </span>
        {notification>0 && <span className="conversationBadge">{notification }</span>}
      </div>
     
    </div>
  );
}
