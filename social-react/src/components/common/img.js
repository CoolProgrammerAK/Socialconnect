import React from 'react'
export default function ImageVideo({post}) {
    return (
        <>
        {
              post.img?post.img.includes("/image/upload")?
              <img
              className="postImg"
              src={post.img}
              alt=""
              loading="lazy"
              
            />
              :
              <video controls className="postImg"  >
              <source src={post.img} type="video/mp4" />
            </video>
           
              :
              <div/>
            }
       </>
    )
}
