import React, { useContext ,lazy,Suspense} from "react";
import Share from "../share/share";
// import Post from "../posts/post";
import "./feed.scss";
import { AuthContextt } from "../../context/Auth/AuthContext";
import SkeletonLoading from "../loading/skeletonloading";
import Connects from "../noconnection/Connects";
import { fetchpostsCall } from "../../postcalls";
import { PostContextt } from "../../context/Post/postContext";
const Post=lazy(()=> import("../posts/post"))

function Feed({ userid }) {
  const [posts, setposts] = React.useState([]);
  const { user } = useContext(AuthContextt);
  const { isfetchingposts } = useContext(PostContextt);
  const [loading, setloading] = React.useState(true);

  React.useEffect(() => {

    fetchpostsCall(userid, user, setposts, setloading);
  }, [userid, user._id, isfetchingposts]);

  return (
    <>
      <div className="feed">
        <div className="feedWrapper">
          {userid ? user._id === userid ? <Share /> : null : <Share />}

          {loading && <SkeletonLoading type="feed"/>}
          {posts && !loading ? (
            posts.length > 0 ? (
              posts.map((post) => {
                return <Suspense fallback={<SkeletonLoading type="feed"/>}><Post post={post} key={post._id}></Post></Suspense>;
              })
            ) : (
              <Connects text=" Currently, user has not posted something."></Connects>
            )
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
}

export default Feed;
