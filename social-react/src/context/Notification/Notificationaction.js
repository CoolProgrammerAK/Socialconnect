

var Authtoken = "Bearer " + localStorage.getItem("token");
export const postNotification = async (name,id, dispatch,type,postId="") => {
  const notify = {
    userid:id,
    sender: name,
    time: new Date().toUTCString(),
    type: type,postId:postId
    
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
      dispatch({
        type: "REFRESHING_NOTIFICATION",
       });
    }
  } catch (error) {
    console.log(error);
  }
};
export const removingNotification =  async (c,dispatch,id,type,postId="") => {
  const converse = {
   type:type,
   sender:c,
   id:id,postId:postId
  };
  try {
    var res = await fetch("/notifications", {
      method: "PUT",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(converse),
    });
    var data = await res.json();
    if (data.notifications) {
      // dispatch({
      //   type: "REMOVING_NOTIFICATION",
      //   payload: converse,
      // });
       dispatch({
        type: "REFRESHING_NOTIFICATION",
       });
    }
  } catch (error) {
    console.log(error);
  }
};

export const readingNotification =  async (dispatch,type,type2="") => {
  const converse = {
   type:type,
   type2:type2
  };
  try {
    var res = await fetch("/notifications/read", {
      method: "PUT",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(converse),
    });
    var data = await res.json();
    if (data.notifications) {
     console.log(data)
       dispatch({
        type: "REFRESHING_NOTIFICATION",
       });
    }
  } catch (error) {
    console.log(error);
  }
};