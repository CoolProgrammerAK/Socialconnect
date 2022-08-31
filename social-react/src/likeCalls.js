var Authtoken = "Bearer " + localStorage.getItem("token");

export const likeHandlercalls = async (post,isliked,setisliked,like,setlike) => {
    try {
      const res = await fetch(`/posts/${post._id}/like`, {
        method: "PUT",
        headers: {
          Authorization: Authtoken,
          "Content-Type": "application/json",
        },
      });

      await res.json();

      setlike(isliked ? like - 1 : like + 1);
      setisliked(!isliked);
    } catch (error) {}
  };