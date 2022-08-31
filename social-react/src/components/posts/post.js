import React, { useState } from "react";
import "./post.scss";

import { AuthContextt } from "../../context/Auth/AuthContext";
import { OnlineContextt } from "../../context/Online/onlinecontext";
import Comment from "../comment/comment";
import TopSection from "../topSection/topSection";
import Editpost from "../editpost/editpost";
import Like from "../common/like";
import ImageVideo from "../common/img";
import { likeHandlercalls } from "../../likeCalls";
import socketconnection from "../../socketconnection";
import { removingNotification } from "../../context/Notification/Notificationaction";
import { NotificationContextt } from "../../context/Notification/notificationcontext";
import { addingNotification } from "../../conversationcalls";
export default function Post({ post }) {
  const [like, setlike] = useState(post.likes.length);
  const { user } = React.useContext(AuthContextt);
  const [isliked, setisliked] = useState(false);
  const [currentuser] = React.useState(post.user);
  const { allonlineusers } = React.useContext(OnlineContextt);
  const { dispatch } = React.useContext(NotificationContextt);
  const likeHandler = async () => {
    await likeHandlercalls(post, isliked, setisliked, like, setlike);
    if (post.user._id != user._id) {
      if (!isliked) {
        if (
          !(
            allonlineusers.length > 0 &&
            allonlineusers.some((item) => item.userid === post.user._id)
          )
        ) {
          await addingNotification(user._id, post.user._id, "Like",post._id);
        } else {
          socketconnection.emit("sendLikeComment", {
            senderId: user._id,
            receiverId: post.user._id,postId:post._id,type:"Like"
          });
        }
      } else {
        if (
          !(
            allonlineusers.length > 0 &&
            allonlineusers.some((item) => item.userid === post.user._id)
          )
        ) {
          await removingNotification(user._id, dispatch,post.user._id,  "Like",post._id);
        } else {
          socketconnection.emit("removeLikeComment", {
            senderId: user._id,
            receiverId: post.user._id,postId:post._id,type:"Like"
          });
        }
      }
    }
  };

  React.useEffect(() => {
    setisliked(post.likes.includes(user._id));
    
  }, [post.likes, user._id]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <TopSection
            time={post.createdAt}
            currentuser={currentuser}
          ></TopSection>
          {user._id === post.user._id && (
            <div className="postTopRight">
              <Editpost post={post} currentuser={currentuser} />
            </div>
          )}
        </div>
        <div className="postCenter">
          <div className="postDescription">
            <span className="postText">{post?.desc}</span>
          </div>
          {post.img ? (
            <div className="postImageMargin">
              <ImageVideo post={post}></ImageVideo>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Like
              like={like}
              isliked={isliked}
              likeHandler={likeHandler}
            ></Like>
          </div>

          <Comment
            post={post}
            currentuser={currentuser}
            likeHandler={likeHandler}
            like={like}
            isliked={isliked}
          ></Comment>
        </div>
      </div>
    </div>
  );
}
