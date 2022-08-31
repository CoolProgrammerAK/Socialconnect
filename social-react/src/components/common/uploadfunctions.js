import React from 'react'
import {Cancel} from '@material-ui/icons'
export default function Uploadfunctions({file,setfile,vidRef}) {
    return (<>
        {file ? (
            file.type.includes("image") ? (
              <div className="shareImgContainer">
                <img
                  className="shareImg"
                  src={URL.createObjectURL(file)}
                  alt=""
                ></img>
                <Cancel

                  className="shareCancelImg"
                  onClick={() => setfile(null)}
                ></Cancel>
              </div>
            ) : (
                
              <div style={{ cursor: "pointer" }} className="shareImgContainer">
                {" "}
                <video controls className="shareImg" ref={vidRef}>
                  <source src={URL.createObjectURL(file)} type="video/mp4" />
                </video>
                <Cancel
                  className="shareCancelImg"
                  onClick={() => setfile(null)}
                ></Cancel>
              </div>
            )
          ) : (
            <div></div>
          )}</>
    )
}

