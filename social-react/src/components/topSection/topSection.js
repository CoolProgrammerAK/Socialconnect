import React from 'react'
import './topSection.scss'
import { Link } from "react-router-dom";
import moment from 'moment' 
function TopSection({currentuser,time}) {
  
    const PF=process.env.REACT_APP_AVATAR
    return (
        <div className="modalLeftTop">
                <Link to={`/profile/${currentuser._id}`}>
                  <img
                    className="modalLeftTopProfileImg"
                    src={
                      currentuser.profilePicture
                        ? currentuser.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                </Link>
                <span className="modalLeftTopUsername">
                  {currentuser.username}
                </span>
                <span className="modalLeftTopDate">
                  {moment(time).fromNow()}
                </span>
               
              </div>
    )
}

export default TopSection
