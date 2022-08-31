import React from "react";
import "./editpost.scss";
import {
  Edit,
  Close,
  DeleteOutline,
  Videocam,
  PermMedia,
} from "@material-ui/icons";
import CircularLoading from "../loading/loading2";
import { Dialog, Tooltip, Slide, IconButton } from "@material-ui/core";
import TopSection from "../topSection/topSection";
import Emoji from "../textFieldEmoji/Emoji";
import ImageVideo from "../common/img";
import Uploadfunctions from "../common/uploadfunctions";
import { AuthContextt } from "../../context/Auth/AuthContext";
import { changehandlercall, submitpostcall } from "../../imageuploadcall";
import { PostContextt } from "../../context/Post/postContext";
import AlertDialog from "../dialog/dialog";
import { deletepostcall } from "../../postcalls";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Editpost({ currentuser, post }) {
  const { dispatch } = React.useContext(PostContextt);
  const [open, setOpen] = React.useState(false);
  const [opendeletedialog, setOpenDeleteDialog] = React.useState(false);
  const [showinput, setshowinput] = React.useState(!post.img ? true : false);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const description = React.useRef(post.desc);
  const vidRef2 = React.useRef(null);
  const [error2, seterror2] = React.useState("");
  const [file2, setfile2] = React.useState(null);
  const [loader, setloader] = React.useState(false);
  const [dloader, setdloader] = React.useState(false);
  const { user } = React.useContext(AuthContextt);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setfile2(null);
    setshowinput(!post.img ? true : false);
  };

  const submit =async (e) => {
    e.preventDefault();
    setOpenEmoji(false);
    seterror2("");

    var data = {
      setloading: setloader,
      file: file2 === null ? (showinput ? null : post.img) : file2,
      desc: description,
      user,
      post,
      setfile: setfile2,
    };
   await submitpostcall(data, dispatch);
   setOpen(false)
  };

  const deletepost = async() => {
    setdloader(true);
    await deletepostcall(post, dispatch,setOpenDeleteDialog, setOpen);
    setdloader(false)
  };
  const changehandler = (e) => {
    changehandlercall(seterror2, setfile2, e);
  };
  return (
    <>
      <Tooltip title="Edit Post" arrow>
        <IconButton onClick={handleClickOpen} className="editIcon">
          <Edit></Edit>
        </IconButton>
      </Tooltip>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        {opendeletedialog && (
          <AlertDialog
            open={opendeletedialog}
            setopen={setOpenDeleteDialog}
            deletefunction={deletepost}
            loading={dloader}
          ></AlertDialog>
        )}
        <div className="editPostAppbar editPostflex">
          <div className="editPostAppbarLeft editPostflex">
            <Tooltip title="Close" arrow>
              <IconButton onClick={handleClose}>
                <Close style={{ color: "white" }}></Close>
              </IconButton>
            </Tooltip>
            <h3 className="editPostAppbarLeftHeading">Edit post</h3>
          </div>
          <div className="editPostflex">
            <button
              className="editPostAppbarRightButton backgroundButton"
              disabled={loader}
              onClick={(e) => submit(e)}
            >
              {loader ? (
                <CircularLoading colors="white"></CircularLoading>
              ) : (
                <span style={{ fontSize: 15 }}>Update</span>
              )}
            </button>
            <button
              className="editPostAppbarRightButton"
              onClick={(e) => setOpenDeleteDialog(true)}
            >
              <span style={{ fontSize: 15 }}>Delete</span>
            </button>
          </div>
        </div>
        <div className="editPostBody">
          <div className="editPostSection editPostflex">
            <div className="editPostSectionInner">
              <TopSection
                time={post.updatedAt}
                currentuser={currentuser}
              ></TopSection>
              <div className="editPostMiddleSection">
                <div className="editPostMiddleSectionBox editPostm">
                  <p className="editPostMiddleDescription editPostMargin">
                    Description
                  </p>
                  <Emoji
                    username={currentuser.username}
                    special={true}
                    innerRef={description}
                    value={post.desc}
                    open={openEmoji}
                    placeholder={"Description "}
                    setOpen={setOpenEmoji}
                  ></Emoji>
                </div>
                {showinput && (
                  <div className="editPostMiddleSectionBox">
                    <p className="editPostMiddleDescription editPostMargin">
                      Upload Image/Photo
                    </p>
                    {error2 != "" && (
                      <p
                        style={{
                          color: "red",
                          fontWeight: 600,
                          marginBottom: "10px",
                          fontFamily: "system-ui",
                        }}
                      >
                        {error2}
                      </p>
                    )}
                    <Uploadfunctions
                      file={file2}
                      setfile={setfile2}
                      vidRef={vidRef2}
                    ></Uploadfunctions>
                    <div className="editPostImageSection editPostflex">
                      <div className="editPostflex editPostImageWrapper editLeftm">
                        <label htmlFor="file2" className="shareOption">
                          <PermMedia htmlColor="tomato" className="shareIcon" />
                          <span className="shareOptionText">Photo</span>
                          <input
                            style={{ display: "none" }}
                            id="file2"
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={(e) => changehandler(e)}
                          ></input>
                        </label>
                      </div>

                      <div className="editPostflex editPostImageWrapper">
                        <label htmlFor="video2" className="shareOption">
                          <Videocam htmlColor="blue" className="shareIcon" />
                          <span className="shareOptionText">Video</span>
                          <input
                            style={{ display: "none" }}
                            id="video2"
                            type="file"
                            accept=".mp4,.wmv"
                            onChange={(e) => changehandler(e)}
                          ></input>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                {post.img && !showinput && (
                  <div className="editPostMiddleSectionBox">
                    <div className="editPostAlign editPostflex">
                      <p className="editPostMiddleDescription">
                        {post.img.includes("/image/upload") ? "Image" : "Video"}
                      </p>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          onClick={() => {
                            setshowinput(true);
                          }}
                          className="deleteIcon"
                          color="secondary"
                        >
                          <DeleteOutline></DeleteOutline>
                        </IconButton>
                      </Tooltip>
                    </div>
                    <ImageVideo post={post}></ImageVideo>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
export default Editpost;
