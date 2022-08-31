import { showtoasterror } from "./components/toast/toast";
import socketconnection from "./socketconnection";
import { addingNotification } from "./conversationcalls";
var Authtoken = "Bearer " + localStorage.getItem("token");

export const fetchcomments = async (post,setcomments,setcloading) => {
    try {
      const res = await fetch(`/posts/${post._id}/comment`, {
        method: "GET",
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error);
       
      } else {
        setcomments(
          data.comments.sort((v1, v2) => {
            return new Date(v2.time) - new Date(v1.time);
          })
        );
      }
    } catch (error) {
      console.log(error)
    } finally {
      setcloading(false);
    }
  };

 export const addcomment = async (data) => {
     var { fet,comment,post,fetched,allonlineusers,user}=data
    var commentdata = { comment: comment.current.value };
    try {
      const res = await fetch(`/posts/${post._id}/comment`, {
        method: "PUT",
        body: JSON.stringify(commentdata),
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        showtoasterror("Something went wrong. Try again later");
      } else {
        // console.log(data)
        if (post.user._id != user._id) {
          if (
            !(
              allonlineusers.length > 0 &&
              allonlineusers.some((item) => item.userid === post.user._id)
            )
          ) {
            await addingNotification(user._id, post.user._id, "Comment", data.id);
          } else {
            socketconnection.emit("sendLikeComment", {
              senderId: user._id,
              receiverId: post.user._id,
              postId: data.id,type:"Comment"
            });
          }
      
      }
        fetched(!fet);
      }
    } catch (error) {
      console.log(error)
    } finally {
      comment.current.value = "";
    }
  };

 export const deletecommentcall = async (data) => {
    var {    post,load,setload,id,userid}=data
    var commentdata2 = {
      id: id,
      userid:userid
    };

    try {
      const res = await fetch(`/posts/${post._id}/comment`, {
        method: "DELETE",
        body: JSON.stringify(commentdata2),
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        showtoasterror(data.error);
      } else {
        setload(!load);
      }
    } catch (error) {
      console.log(error)
    }
  };