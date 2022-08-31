import React from 'react'
import './CloseFriend.scss'
import {Link} from 'react-router-dom'
function CloseFriend({user}) {
    const PF=process.env.REACT_APP_AVATAR
    return (
<Link to={"/profile/"+ user._id}>

        <li className="sidebarFriend" >
     <img className="sidebarFriendImg" alt={""} src={user.profilePicture ? user?.profilePicture : PF + "person/noAvatar.png"} ></img>
        <span className="sidebarFriendName">{user.username}</span>
    </li>
</Link>
    )
}

export default CloseFriend
