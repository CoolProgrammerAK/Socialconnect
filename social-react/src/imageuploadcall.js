import { showtoasterror, showtoastsuccess } from "./components/toast/toast";

var Authtoken = "Bearer " + localStorage.getItem("token");

export const changehandlercall = (seterror, setfile, e) => {
  seterror("");
  const maxAllowedSize = 5 * 1024 * 1024;

  if (e.target.files[0].size > maxAllowedSize) {
    seterror("File size should be less than 5 MB");
  } else {
    setfile(e.target.files[0]);
  }
};

export const submitpostcall = async (data, dispatch, success = false) => {
  var { setloading, file, desc, user, setfile, post } = data;

  const newpost = {
    desc: desc.current.value,
    img: "",
  };

  if (!file && !desc.current.value) {
    showtoasterror("Cannot publish empty post");
  } else {
    setloading(true);
    if (file) {
      var data = new FormData();

      var filename =
        user._id + "_" + user.username + "/post/" + "_" + Date.now();
      data.append("upload_preset", "social");

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
          newpost.img = data2.url;
        }

        //
      } catch (error) {
        showtoasterror(error.message);
        setloading(false);
      }
    }
    try {
      var resd = await fetch(success ? `/posts/` : `/posts/${post._id}`, {
        method: success ? "POST" : "PUT",
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newpost),
      });
      var data2 = await resd.json();
      if (data2.error) {
        showtoasterror("Something went wrong");
      } else {
        setfile(null);
        desc.current.value = "";
        showtoastsuccess(
          success ? "Post added successfully" : "Post updated successfully"
        );
        dispatch({ type: "FETCHING_POSTS" });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }
};
