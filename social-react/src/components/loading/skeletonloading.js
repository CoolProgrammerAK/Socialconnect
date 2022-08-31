


import React from "react";
import { Skeleton } from "@material-ui/lab";

export default function SkeletonLoading({type}) {

  const FeedSkeleton=()=>{
   return ( <div className="post " style={{margin:'25px 0px'}}>
    <div className="postWrapper">
      <div className="postTop">
      <Skeleton animation="wave" variant="circle" width={40} height={40} />
        <Skeleton animation="wave" height={15} width="100%" style={{ margin: "6px 0px" }} />
        </div>
        <div className="postCenter">
        <Skeleton animation="wave" variant="rect" height={250} style={{ margin: "10px 0px" }}  />
          </div>
          <div className="postBottom">
          <div className="postBottomLeft">
          <Skeleton animation="wave" width="150px"  height={20}   />
            </div>
            <div className="postBottomRight">
          <Skeleton animation="wave" width="150px" height={20}   />
            </div></div>
        </div></div>)
  }
  
  const OnlineSkeleton=()=>{
    return (  <div className="conversation">
      <Skeleton animation="wave" variant="circle" width={70} height={50} />
        <Skeleton animation="wave" height={35} width="100%" style={{ margin: "0px 15px" }} />
      </div>)
   }
  if (type=="feed"){
     return Array(2).fill(<FeedSkeleton></FeedSkeleton>)
  }
  else if (type=="conversation"){
    return Array(2).fill(<OnlineSkeleton></OnlineSkeleton>)
 }

}
