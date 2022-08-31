import React, { useEffect } from "react";
import "./sidebar.scss";

import { Users } from "../../dummydata";
import {
  RssFeed,
  Chat,
  Group,
  School,
  Event,
  Bookmark,
  PlayCircleFilledOutlined,
  HelpOutline,
  WorkOutline,
} from "@material-ui/icons";
import { AuthContextt } from "../../context/Auth/AuthContext";
import CloseFriend from "../closefirend/CloseFriend";
import { fetchfanscall } from "../../profilecalls";
function Sidebar() {
  const { user } = React.useContext(AuthContextt);
  const [fans, setfans] = React.useState([]);
  React.useEffect(() => {
    user?._id && fetchfanscall(user, setfans);
  }, [user?._id]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon"></RssFeed>
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarList">
        <h4 className="sidebarTitle">My followers</h4>
          {fans.length>0 && fans.map((user) => {
            return <CloseFriend user={user} key={user._id}></CloseFriend>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
