import { showtoasterror, showtoastsuccess } from "./components/toast/toast";
import { logoutCall } from "./profilecalls";
var Authtoken = "Bearer " + localStorage.getItem("token");

export const fetchpostsCall = async (userid, user, setposts, setloading) => {
  try {
    const res = await fetch(
      userid ? `/posts/profile/${userid}` : `/posts/timeline/${user._id}`,
      {
        method: "GET",
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (data.error) {
      if(data.error=="invalid token"){
        logoutCall()
      }
    } else {
      setposts(
        data.posts.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    setloading(false);
  }
};

// export const fetchuserbypostcall = async (post,setuser) => {
//   try {
//     const res = await fetch(`/users/${post.userId}`, {
//       method: "GET",
//       headers: {
//         Authorization: Authtoken,
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();

//     setuser(data.user);
//   } catch (error) {
//     console.log(error);
//   }
// };


export const deletepostcall = async (post,dispatch,setOpenDeleteDialog,setopen) => {
 
  try {
    const res = await fetch(`/posts/${post._id}`, {
      method: "DELETE",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.error) {
      showtoasterror("Something went wrong");
    } else {
     
     showtoastsuccess("Post deleted successfully");
     setOpenDeleteDialog(false)
     setopen(false)
     dispatch({type:"FETCHING_POSTS"})
    }
    
  } catch (error) {
    console.log(error);
  }
  
};