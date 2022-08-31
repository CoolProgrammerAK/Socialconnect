import { showtoasterror, showtoastsuccess } from "./components/toast/toast";
var Authtoken = "Bearer " + localStorage.getItem("token");


export const fetchallusers=async(seterror,id,setusers)=>{
  try{
  const res = await fetch(`/users/allusers/${id}`, {
    method: "GET",
    headers: {
      Authorization: Authtoken,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.error) {
    seterror(true)
  } else {
    setusers(data.users);
    console.log(data.users)
  }
} catch (error) {
  seterror(true)
  console.log(error);
} 
}


export const fetchuser=async(seterror,id,setuser)=>{
  try{
  const res = await fetch(`/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: Authtoken,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.error) {
    seterror(true)
  } else {
    setuser(data.user);
  }
} catch (error) {
  seterror(true)
  console.log(error);
} 
}


export const followCall = async (userDetails) => {
  userDetails.setloading(true);

  try {
    var res;
    if (userDetails.follow) {
      res = await fetch(`/users/${userDetails.cuser._id}/unfollow`, {
        method: "PUT",
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
      });
    } else {
      res = await fetch(`/users/${userDetails.cuser._id}/follow`, {
        method: "PUT",
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
      });
    }

    var data = await res.json();
    if (data.error) {
      showtoasterror("Something went wrong");
    } else {
      localStorage.setItem("user", JSON.stringify(data.cuser));
      userDetails.setfollow(!userDetails.follow);
    }
  } catch (error) {
    console.log(error);
  } finally {
    userDetails.setloading(false);
  }
};

export const fetchfriendscall = async (cuser, setfriends) => {
  try {
    const res = await fetch(`/users/friends/${cuser?._id}`, {
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
      setfriends(data.friends);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchfanscall = async (cuser, setfans) => {
  try {
    const res = await fetch(`/users/fans/${cuser?._id}`, {
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
      setfans(data.fans);
    }
  } catch (error) {
    console.log(error);
  }
};


export const logoutCall = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
  window.location.pathname="/login"
};

export const changeaccount = async (userCredientials,change,user,handler) => {
 var {setopen}=handler
  try {
  

    fetch(change?`/users/changepassword/${user._id}`:`/users/${user._id}`, {
      method: change?"PUT":"DELETE",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredientials),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          showtoastsuccess(data.msg)
          {!change && logoutCall()}
          setopen(false)
        } else {
          showtoasterror(data.error)
        }
      })
      .catch((error) => {
        console.log(error.message)
      })
  } catch (error) {
    console.log(error)
  }
  
 
};
