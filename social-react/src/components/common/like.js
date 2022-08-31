import React from 'react'
import { IconButton, Tooltip } from "@material-ui/core";

import { ThumbUpOutlined,ThumbUp } from "@material-ui/icons";
export default function Like({like,isliked,likeHandler}) {
    return (
        <>
        <Tooltip title={isliked?"Already Liked":"Like"} arrow>
        <IconButton onClick={likeHandler} className="likeIcon" color="primary" >
        {!isliked?<ThumbUpOutlined  />:<ThumbUp   />}
       </IconButton>
       </Tooltip>
        <span className="postLikeCounter">{isliked?like>=2?" You and "+ `${like-1}` +" other like this post" :"Only you like this post":like>=1? like + 
        " other like this post":" No likes"} </span></>
    )
}
