import { showtoasterror, showtoastsuccess } from "./components/toast/toast";
var Authtoken = "Bearer " + localStorage.getItem("token");

export const updatephoto = async (method, data, file,dispatch,cover=false) => {
  var { user, setload } = data;

  var newpost = { };
  if(cover){
    newpost.coverPicture = ""
  }
  else{
    newpost.profilePicture = ""
  }
  try {
    if (method != "delete") {
      var stringdata=""
      if(cover){
        stringdata="cover_"
      }
      else{
        stringdata="profile_"
      }
      var data = new FormData();
      var filename =user._id +"_" +user.username +"/profile/"+stringdata+"_" +Date.now()
      var preset = "social";
      data.append("upload_preset", preset);

      data.append("file", file);
      data.append("public_id", filename);

      data.append("cloud_name", "avii50341");

      try {
        var res = await fetch(
          `https://api.cloudinary.com/v1_1/avii50341/upload`,
          {
            method: "POST",

            body: data,
          }
        );
        var data2 = await res.json();
        if (data2.error) {
          throw data2.error;
        } else {
          if(cover){
            newpost.coverPicture = data2.url
          }
          else{
            newpost.profilePicture = data2.url
          }
        }
      } catch (error) {
        showtoasterror("Something went wrong");
        setload(false);
      }
    }
    await editposthandler(user,newpost,dispatch,false)
  
    
  } catch (error) {
    console.log(error);
  }
};

export const editposthandler = async (user, details,dispatch,show=true) => {
  try {
    var res = await fetch("/users/" + user._id, {
      method: "PUT",
      headers: {
        Authorization: Authtoken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });
    var data = await res.json();
    if (data.msg) {
      if (show){
        showtoastsuccess(data.msg);}
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch({type:"FETCHING_PROFILE"})
    } else {
      showtoasterror(data.error);
    }
  } catch (error) {
    console.log(error);
  }
};
