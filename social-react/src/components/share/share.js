import React, { useContext } from "react";
import "./share.scss";
import { Room, EmojiEmotions, PermMedia, Videocam } from "@material-ui/icons";
import { AuthContextt } from "../../context/Auth/AuthContext";
import { Picker } from "emoji-mart";
import { ClickAwayListener } from "@material-ui/core";
import Uploadfunctions from "../common/uploadfunctions";
import { changehandlercall, submitpostcall } from "../../imageuploadcall";
import { PostContextt } from "../../context/Post/postContext";
import CircularLoading from "../loading/loading2";

export default function Share() {
  const { dispatch } = useContext(PostContextt);
  const PF = process.env.REACT_APP_AVATAR;
  const { user } = useContext(AuthContextt);
  const desc = React.useRef();
  const [file, setfile] = React.useState(null);
  const [loading, setloading] = React.useState(false);
  const vidRef = React.useRef(null);
  const [error, seterror] = React.useState("");
  const [openEmoji, setOpenEmoji] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setOpenEmoji(false);
    seterror("");
    var data = { setloading, file, desc, user, setfile };
    submitpostcall(data, dispatch, true);
  };
  const changehandler = (e) => {
    changehandlercall(seterror, setfile, e);
  };
  const onEmojiClick = (event) => {
    desc.current.value = desc.current.value + event.native;
  };

  return (
    <>
      <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">
            <img
              className="shareProfileImg"
              src={
                user.profilePicture
                  ? user.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="shareInputBox">
              <input
                ref={desc}
                placeholder={`What's in your mind ${user.username} ? `}
                type="text"
                className={"shareInput"}
                required
              ></input>
            </div>
          </div>

          <hr className="shareHr" />
          {error != "" && (
            <p
              style={{
                color: "red",
                fontWeight: 600,
                marginBottom: "10px",
                fontFamily: "system-ui",
              }}
            >
              {error}
            </p>
          )}
          <Uploadfunctions
            file={file}
            vidRef={vidRef}
            setfile={setfile}
          ></Uploadfunctions>
          <form className="shareBottom" onSubmit={submit}>
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo</span>
                <input
                  style={{ display: "none" }}
                  id="file"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => changehandler(e)}
                ></input>
              </label>
              <div className="shareOption">
                <label htmlFor="video" className="shareOption">
                  <Videocam htmlColor="blue" className="shareIcon" />
                  <span className="shareOptionText">Video</span>
                  <input
                    style={{ display: "none" }}
                    id="video"
                    type="file"
                    accept=".mp4,.wmv"
                    onChange={(e) => changehandler(e)}
                  ></input>
                </label>
              </div>
              {/* <div className="shareOption">
                <Room htmlColor="green" className="shareIcon" />
                <span className="shareOptionText">Location</span>
              </div> */}
              <ClickAwayListener onClickAway={() => setOpenEmoji(false)}>
                <div>
                  <div
                    className="shareOption"
                    onClick={() => setOpenEmoji(!openEmoji)}
                  >
                    <EmojiEmotions
                      htmlColor="goldenrod"
                      className="shareIcon"
                    />
                    <span className="shareOptionText">Feelings</span>
                  </div>

                  {openEmoji && (
                    <Picker
                      style={{
                        position: "absolute",
                        top: 160,
                        right: 126,
                        zIndex: 10,
                      }}
                      notfound="No Emoji Found"
                      perLine={7}
                      showPreview={false}
                      onSelect={onEmojiClick}
                      title="Emoji"
                    />
                  )}
                </div>
              </ClickAwayListener>
            </div>
            <button className="shareButton" type="submit" disabled={loading}>
              {loading ? (
                <CircularLoading colors="green"></CircularLoading>
              ) : (
                <span style={{ fontSize: 15 }}>Post</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
