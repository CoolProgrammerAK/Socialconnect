import React from "react";
import "./profile.scss";
import { IconButton, Tooltip } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import Feed from "../../components/feeds/feed";
import Rightbar from "../../components/rightbar/rightbar";
import Toolbar from "../../components/toolbar/toolbar";
import Sidebar from "../../components/sidebar/sidebar";
import ToastContainer from "../../components/toast/toastContainer";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "../../components/loading/backdrop";
import Notfound from "../../components/notfound/notfound";
import { fetchuser } from "../../profilecalls";
import { updatephoto } from "../../editProfilecalls";
import { PostContextt } from "../../context/Post/postContext";
import {useLocation} from 'react-router-dom'

function Profile(props) {
  const PF = process.env.REACT_APP_AVATAR;
  const [coverload, setcoverload] = React.useState(false);
  const {dispatch,isfetchingprofile}=React.useContext(PostContextt)
  const [user, setuser] = React.useState({});
  const [loading, setloading] = React.useState(true);
  const [error, seterror] = React.useState(false);

  React.useEffect(() => {
    const fetchusers = async () => {
      seterror(false);
      await fetchuser(seterror, props.match.params.userid, setuser);
      setloading(false);
    };
    fetchusers();
  }, [props.match.params.userid,isfetchingprofile]);
 
  const changecoverphoto = async (e) => {
    setcoverload(true);
    var data = {
      user: user,
      setload: setcoverload,
    };
    await updatephoto("update", data, e.target.files[0],dispatch, true);
    setcoverload(false);
  };

  return (
    <>
      <Toolbar />
      <ToastContainer />
      <div className="profile">
        <Sidebar />
     
        { !error ? (
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <div className="Cover">
                  <div className="editCoverIcon">
                    
                    
                      <Tooltip title="Edit Cover photo" arrow>
                        <IconButton className="editIcon">
                          <label htmlFor="coverfile">
                            <Edit></Edit>
                            <input
                              style={{ display: "none" }}
                              id="coverfile"
                              type="file"
                              accept=".png,.jpg,.jpeg"
                              onChange={(e) => changecoverphoto(e)}
                            ></input>
                          </label>
                        </IconButton>
                      </Tooltip>
                   {coverload && <Backdrop></Backdrop>}
                  </div>
                  <img
                    className="profileCoverImg"
                    src={
                      user
                        ? user.coverPicture || PF + "person/noCover.png"
                        : PF + "person/noCover.png"
                    }
                    alt=""
                  />
                </div>

                <img
                  className="profileUserImg"
                  src={
                    user
                      ? user.profilePicture || PF + "person/noAvatar.png"
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">
                  {user ? user.username : "NA"}
                </h4>
                <span className="profileInfoDesc">
                  {user && user.desc ? user.desc : ""}
                </span>
              </div>
            </div>
            <div className="profileRightBottom">
              <Feed userid={props.match.params.userid} />
              <Rightbar cuser={user} load={loading} />
            </div>
          </div>
        ) : (
          <div className="profileRight">
            <Notfound></Notfound>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
