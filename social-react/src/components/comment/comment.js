import React from "react";
import "./comment.scss";
import { Modal, Backdrop, Fade, Tooltip, Chip } from "@material-ui/core";

import { Cancel, ArrowUpward } from "@material-ui/icons";
import { AuthContextt } from "../../context/Auth/AuthContext";
import ImageVideo from "../common/img";
import Connects from "../noconnection/Connects";
import Emoji from "../textFieldEmoji/Emoji";
import SingleComment from "../singleComment/singleComment";
import TopSection from "../topSection/topSection";
import Like from "../common/like";
import { addcomment, fetchcomments } from "../../commentcalls";
import CircularLoading from "../loading/loading2";

import { OnlineContextt } from "../../context/Online/onlinecontext";
import { removingNotification } from "../../context/Notification/Notificationaction";
import { NotificationContextt } from "../../context/Notification/notificationcontext";
export default function Comments({
  post,
  currentuser,
  isliked,
  likeHandler,
  like,
}) {
  const [open, setOpen] = React.useState(false);

  const { user } = React.useContext(AuthContextt);
  const comment = React.useRef();
  const [loading, setloading] = React.useState(false);
  const [cloading, setcloading] = React.useState(false);
  const [comments, setcomments] = React.useState(post.comments);
  const [fet, fetched] = React.useState(false);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [deletel, setdeletel] = React.useState("");
  const { allonlineusers } = React.useContext(OnlineContextt);
 
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setcloading(true);
    setOpenEmoji(false);

    fetchcomments(post, setcomments, setcloading);
  }, [fet, post._id]);

  const submit = async (e) => {
    e.preventDefault();
    setloading(true);
    var data = {
      fet,allonlineusers,
      comment,
      post,
      fetched,user
    };
    await addcomment(data);
    
    
    setloading(false);
  };

  return (
    <div className="postBottomRight">
      <span className="postCommentText" onClick={handleOpen}>
        {comments.length == 0 ? "No Comments" : comments.length + " Comments"}
      </span>
      <Modal
        className="modal"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="modalHorizontalBox">
            <Tooltip title="Close" arrow>
              <div className="cancelBox">
                <Cancel className="cancelIcon" onClick={handleClose}></Cancel>
              </div>
            </Tooltip>

            <div className="modalLeft">
              <TopSection
                time={post.createdAt}
                currentuser={currentuser}
              ></TopSection>
              <div className="postDescription">
                <p className="postText">{post?.desc}</p>
              </div>
              {post.img ? (
                <div className="postImageMargin">
                  <ImageVideo post={post}></ImageVideo>
                </div>
              ) : (
                <div style={{ margin: "4px 0px" }}></div>
              )}
              <div className="modalLeftBottom">
                <Like
                  like={like}
                  isliked={isliked}
                  likeHandler={likeHandler}
                ></Like>
              </div>
            </div>
            <hr className="hr" />
            <div className="modalRight">
              <span className="modalRightTopUsername">Comment Section</span>

              <div className="commentSection">
                <div className="commentSectionInner">
                  {cloading && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Chip
                        label="Fetching..."
                        color="primary"
                        icon={<ArrowUpward></ArrowUpward>}
                      ></Chip>
                    </div>
                  )}
                  {comments.length > 0 ? (
                    comments.map((commentt, index) => {
                      return (
                        <SingleComment
                          key={commentt._id}
                          comment={commentt}
                          setload={fetched}
                          load={fet}
                          post={post}
                          del={deletel}
                          setdelete={setdeletel}
                        ></SingleComment>
                      );
                    })
                  ) : (
                    <Connects text="No comments"></Connects>
                  )}
                </div>
                <form className="commentBottom" onSubmit={submit}>
                  <Emoji
                    username={user.username}
                    special={false}
                    innerRef={comment}
                    open={openEmoji}
                    placeholder={"Comment "}
                    setOpen={setOpenEmoji}
                  ></Emoji>

                  <button
                    className="commentSubmit"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularLoading colors="teal"></CircularLoading>
                    ) : (
                      "Comment"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
