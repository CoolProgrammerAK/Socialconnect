import React from "react";
import { DeleteOutline } from "@material-ui/icons";
import moment from "moment";
import { Tooltip, IconButton } from "@material-ui/core";

import { Link } from "react-router-dom";
import { deletecommentcall } from "../../commentcalls";
import CircularLoading from "../loading/backdrop";
import { AuthContextt } from "../../context/Auth/AuthContext";
import { removingNotification } from "../../context/Notification/Notificationaction";
import { NotificationContextt } from "../../context/Notification/notificationcontext";
import socketconnection from "../../socketconnection";
import { OnlineContextt } from "../../context/Online/onlinecontext";
export default function SingleComment({
  comment,
  setload,
  load,
  post,
  del,
  setdelete,
}) {
  const { user } = React.useContext(AuthContextt);
  const PF = process.env.REACT_APP_AVATAR;
  const { allonlineusers } = React.useContext(OnlineContextt);
  const { dispatch } = React.useContext(NotificationContextt);
  const deletecomment = async(id) => {
    var data = {
      post,
      load,
      setload,id,userid:user._id
    };
    
    setdelete(id);
  await  deletecommentcall(data);
  if (post.user._id != user._id) {
  
      if (
        !(
          allonlineusers.length > 0 &&
          allonlineusers.some((item) => item.userid === post.user._id)
        )
      ) {
        await removingNotification(user._id, dispatch,post.user._id,  "Comment",id);
      } else {
        socketconnection.emit("removeLikeComment", {
          senderId: user._id,
          receiverId: post.user._id,postId:id,type:"Comment"
        });
      }
    
  }
  setdelete("")
  };
  console.log(comment,user._id)
  return (
    <div className="comment">
      <div className="commentLeft">
        <Link to={`/profile/${comment.userProfile?._id}`}>
          <img
            className="modalLeftTopProfileImg"
            src={comment.userProfile?.profilePicture ? comment.userProfile?.profilePicture : PF + "person/noAvatar.png"}
            alt=""
          />
        </Link>
      </div>

      <div className="commentCenter">
        <Link
          to={`/profile/${comment.userProfile?._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <p className="commentTextTitle">
            <span className="commentUsername">{comment.userProfile?.username} </span>

            <span className="commentText">{comment.comment}</span>
          </p>
          <p className="commentDate">{moment(comment.time).fromNow()}</p>
        </Link>{" "}
      </div>

      <div className="commentRight">
        {( user._id === comment.userProfile._id) ? (
         
           <>
           
            <Tooltip title="Delete" arrow>
              <IconButton
              disabled={del==comment._id}
                onClick={() =>
                  deletecomment(comment._id)
                }
                // className="deleteIcon"
              >
                <DeleteOutline></DeleteOutline>
              </IconButton>
            </Tooltip>
             
            </>
      
            
          )
         : null}
      </div>
    </div>
  );
}
