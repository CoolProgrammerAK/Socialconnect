import socket from "./socketconnection";
var Authtoken = "Bearer " + localStorage.getItem("token");
export const getconversation = async (
  user,
  setconversations,
  setfetchconversation
) => {
  try {
    setfetchconversation(true);
    var res = await fetch("/conversation/" + user._id, {
      method: "GET",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
    });
    var data = await res.json();
    if (data.conversation) {
      setconversations(data.conversation);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setfetchconversation(false);
  }
};

export const getspecificconversation = async (
  user,
  setcurrentchat,
  requser,
  setrefreshingconversation,refreshingconversation
) => {
  try {
    var res = await fetch("/conversation/find/" + user._id + "/" + requser._id, {
      method: "GET",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
    });
    var data = await res.json();
    if (data.conversation) {
      setcurrentchat(data.conversation);
    }

    else{
     await postconversation({user1:user._id,user2:requser._id},setcurrentchat)
     socket.emit('conversationUpdate',requser._id)
     setrefreshingconversation(!refreshingconversation)
    }
  } catch (error) {
    console.log(error);
  }
};

export const postconversation = async (postdata, setcurrentchat) => {
  try {
    var res = await fetch("/conversation", {
      method: "POST",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postdata),
    });
    var data = await res.json();

    if (data.conver) {
      setcurrentchat(data.conver);
    }
  } catch (error) {
    console.log(error);
  }
};




export const getmessages = async (
  currentchat,
  setmessages,
  setfetchmessages
) => {
  try {
    setfetchmessages(true);
    var res = await fetch("/messages/" + currentchat?._id, {
      method: "GET",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
    });
    var data = await res.json();
    if (data.messages) {
     
      setmessages(data.messages[0].messages);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setfetchmessages(false);
  }
};

export const postmessages = async (postdata, setmessages, messages) => {
  try {
    var res = await fetch("/messages", {
      method: "POST",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postdata),
    });
    var data = await res.json();

    if (data.message) {
      setmessages([...messages,data.message]);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchingnotification = async (id,dispatch) => {
  try {
    var res = await fetch("/notifications/"+id, {
      method: "GET",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      }
    });
    var data = await res.json();

    if (data.notifications) {
      dispatch({
        type: "FETCHING_NOTIFICATION",
        payload:data.notifications,
      });
    }
  } catch (error) {
    console.log(error);
  }
};


export const addingNotification = async (name,receiverid,type,postId="") => {
  const notify = {
    userid:receiverid,
    sender: name,
    time: new Date().toUTCString(),
    type: type,postId
  };
  try {
    var res = await fetch("/notifications", {
      method: "POST",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notify),
    });
    var data = await res.json();
    if (data.notification) {
    console.log(data)
    }
  } catch (error) {
    console.log(error);
  }
};