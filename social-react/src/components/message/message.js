import React from 'react'
import './message.scss'
import moment from 'moment'
export default function Message({message,time,own,photo}) {
    
    const PF=process.env.REACT_APP_AVATAR
   
    return (
        <div className={own?"message own":"message"}>
             <div className="messageTop">
            
             <img className="messageImg" src={photo!=""?photo:PF+"person/noAvatar.png"}></img>
             <p className="messageText">{message}</p>
            </div>
         {time!=null &&   <div className="messageBottom">
           {moment(time).fromNow()}
            
            </div>}
            
        </div>
    )
}
