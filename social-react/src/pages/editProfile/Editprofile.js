import React from "react";
import { editposthandler, updatephoto } from "../../editProfilecalls";
import "./Editprofile.scss";
import Notfound from "../../components/notfound/notfound";
import Toolbar from "../../components/toolbar/toolbar";
import CircularLoading from "../../components/loading/loading2";
import Backdrop from "../../components/loading/backdrop";
import ToastContainer from "../../components/toast/toastContainer";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Changepassword from "../../components/changepassword/changepassword";
import { PostContextt } from "../../context/Post/postContext";
import { fetchuser } from "../../profilecalls";

export default function Editprofile(props) {
  const PF = process.env.REACT_APP_AVATAR;
  const name = React.useRef();
  const desc = React.useRef();
  const phone = React.useRef();
  const { dispatch, isfetchingprofile } = React.useContext(PostContextt);
  const dob = React.useRef();
  const city = React.useRef();
  const from = React.useRef();
  const relation = React.useRef();
  const [deleteload, setdeleteload] = React.useState(false);
  const [editload, seteditload] = React.useState(false);
  const [user, setuser] = React.useState({});
  const [load, setload] = React.useState(false);
  const [submitload, setsubmitload] = React.useState(false);
  const [changemodal, setchangemodal] = React.useState(false);
  const [deletemodal, setdeletemodal] = React.useState(false);
  const [error, seterror] = React.useState(false);
  React.useEffect(() => {
    const fetchusers = async () => {
      setload(true);
      setdeleteload(false)
      setsubmitload(false)
      seteditload(false)
      seterror(false);
      await fetchuser(seterror, props.match.params.userid, setuser);
      setload(false);
    };
    fetchusers();
  }, [props.match.params.userid, isfetchingprofile]);
  const deletephoto = async () => {
    setdeleteload(true);
    var data = {
      user: user,
      setload: setdeleteload,
    };
    await updatephoto("delete", data, "", dispatch, false);
    setdeleteload(false);
  };
  const changephoto = async (file) => {
    seteditload(true);
    var data = {
      user: user,
      setload: seteditload,
    };
    await updatephoto("update", data, file, dispatch);
    seteditload(false);
  };
  const changehandler = (e) => {
    changephoto(e.target.files[0]);
  };

  const submithandler = async (e) => {
    e.preventDefault();
    setsubmitload(true);
    var data = {
      username: name.current.value,
      desc: desc.current.value,
      phone: phone.current.value,
      city: city.current.value,
      from: from.current.value,
      dob: dob.current.value,
      relationship: relation.current.value,
    };
    await editposthandler(user, data, dispatch);
    setsubmitload(false);
  };
  return (
    <>
      <ToastContainer />
      <Toolbar allUsers={props.allUsers}></Toolbar>
      {submitload || (load && <Backdrop />)}
      {changemodal && (
        <Changepassword
          open={changemodal}
          setopen={setchangemodal}
          change={true}
        ></Changepassword>
      )}
      {deletemodal && (
        <Changepassword
          open={deletemodal}
          setopen={setdeletemodal}
          change={false}
        ></Changepassword>
      )}
      <div className="editProfileSection">
        <div className="editProfileSectionWrapper">
          {error ? (
            <Notfound></Notfound>
          ) : (
            <div className="editProfileSectionInner">
              <div className="editProfileSectionContainer">
                <div className="editProfileSectionImg">
                  <p className="editPostHeading">Profile Photo</p>
                  <img
                    className="editProfilePicture"
                    src={
                      user.profilePicture
                        ? user.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                  ></img>
                  <div className="editProfileImgButtons">
                    <button disabled={editload} className="editChangeButton">
                      <label htmlFor="file3">
                        {editload ? (
                          <div className="loadingSpinner">
                            <CircularLoading colors="gray"></CircularLoading>
                            <span style={{ marginLeft: 5 }}>Uploading</span>
                          </div>
                        ) : (
                          "Change Photo"
                        )}
                        <input
                          style={{ display: "none" }}
                          id="file3"
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => changehandler(e)}
                        ></input>
                      </label>
                    </button>

                    <button
                      className="editRemoveButton"
                      onClick={deletephoto}
                      disabled={deleteload || user.profilePicture == ""}
                    >
                      {deleteload ? (
                        <div className="loadingSpinner">
                          <CircularLoading colors="gray"></CircularLoading>
                          <span style={{ marginLeft: 5 }}>Removing</span>
                        </div>
                      ) : (
                        <span>Remove Photo</span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="editProfileSectionImg">
                  <p className="editPostHeading">User Details</p>
                  <div className="editInputBox">
                    <div className="editInputField">
                      <label className="editLabel">Email</label>
                      <input
                        className="editInput"
                        defaultValue={user.email}
                        readOnly
                      ></input>
                    </div>
                    <div className="editInputField">
                      <label className="editLabel">Name</label>
                      <input
                        className="editInput"
                        defaultValue={user.username}
                        ref={name}
                      ></input>
                    </div>

                    <div className="editInputField">
                      <label className="editLabel">Description</label>
                      <input
                        className="editInput"
                        placeholder="Tell something about yourself"
                        ref={desc}
                        defaultValue={user.desc}
                      ></input>
                    </div>
                    <div className="editInputField">
                      <label className="editLabel">Contact</label>
                      <input
                        className="editInput"
                        type="tel"
                        maxLength="10"
                        placeholder="Contact number"
                        ref={phone}
                        defaultValue={user.phone}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="editProfileSectionImg">
                  <p className="editPostHeading">Biography</p>
                  <div className="editInputBox">
                    <div className="editInputField">
                      <label className="editLabel">DOB</label>
                      <input
                        type="date"
                        className="editInput"
                        placeholder="Choose your birth date"
                        ref={dob}
                        max={moment(new Date())
                          .subtract(10, "years")
                          .format("YYYY-MM-DD")}
                        defaultValue={moment(user.dob).format("YYYY-MM-DD")}
                      ></input>
                    </div>
                    <div className="editInputField">
                      <label className="editLabel">City</label>
                      <input
                        className="editInput"
                        placeholder="Current location"
                        ref={city}
                        defaultValue={user.city}
                      ></input>
                    </div>
                    <div className="editInputField">
                      <label className="editLabel">From</label>
                      <input
                        className="editInput"
                        placeholder="From where are you located"
                        ref={from}
                        defaultValue={user.from}
                      ></input>
                    </div>
                    <div className="editInputField">
                      <label className="editLabel">Relationship</label>
                      <select
                        ref={relation}
                        className="editInput2"
                        defaultValue={relation.current}
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Ready to Mingle">Ready to Mingle</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="editProfileSectionButtons">
                  <button
                    className="editSaveButton"
                    onClick={submithandler}
                    disabled={submitload}
                  >
                    <span>Save Details</span>
                  </button>
                  <button
                    className="editPassButton"
                    onClick={() => setchangemodal(true)}
                  >
                    <span>Change password</span>
                  </button>
                  {/* <button
                    className="editDeleteButton"
                    onClick={() => setdeletemodal(true)}
                  >
                    <span>Delete Account</span>
                  </button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
